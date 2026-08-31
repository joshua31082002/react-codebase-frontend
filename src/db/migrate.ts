import "dotenv/config";
import postgres from "postgres";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgres://revolte:revolte@127.0.0.1:5432/atelier";

const sql = postgres(databaseUrl, { ssl: false, max: 1 });

async function migrate() {
  await sql`CREATE EXTENSION IF NOT EXISTS btree_gist`;

  await sql`
    CREATE TABLE IF NOT EXISTS organizations (
      id text PRIMARY KEY,
      name text NOT NULL,
      slug text NOT NULL UNIQUE,
      status text NOT NULL DEFAULT 'active',
      approval_capacity_threshold integer NOT NULL DEFAULT 8,
      default_timezone text NOT NULL DEFAULT 'Europe/London',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sites (
      id text PRIMARY KEY,
      org_id text NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      name text NOT NULL,
      timezone text NOT NULL,
      address text,
      kiosk_enabled boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS sites_org_idx ON sites (org_id)`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS sites_org_name_idx ON sites (org_id, name)`;

  await sql`
    CREATE TABLE IF NOT EXISTS resources (
      id text PRIMARY KEY,
      org_id text NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      site_id text NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
      kind text NOT NULL,
      name text NOT NULL,
      capacity integer NOT NULL DEFAULT 1,
      amenities jsonb NOT NULL DEFAULT '[]'::jsonb,
      min_lead_minutes integer NOT NULL DEFAULT 0,
      max_duration_minutes integer NOT NULL DEFAULT 480,
      cancel_cutoff_minutes integer NOT NULL DEFAULT 60,
      requires_checkin boolean NOT NULL DEFAULT false,
      checkin_grace_minutes integer NOT NULL DEFAULT 10,
      active boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS resources_org_site_idx ON resources (org_id, site_id)`;
  await sql`CREATE INDEX IF NOT EXISTS resources_org_kind_idx ON resources (org_id, kind)`;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id text PRIMARY KEY,
      org_id text NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      email text NOT NULL,
      name text NOT NULL,
      password_hash text NOT NULL,
      role text NOT NULL DEFAULT 'employee',
      status text NOT NULL DEFAULT 'active',
      last_login_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS users_org_email_idx ON users (org_id, email)`;
  await sql`CREATE INDEX IF NOT EXISTS users_org_role_idx ON users (org_id, role)`;

  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id text PRIMARY KEY,
      user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      org_id text NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      token_hash text NOT NULL UNIQUE,
      expires_at timestamptz NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions (user_id)`;

  await sql`
    CREATE TABLE IF NOT EXISTS login_attempts (
      id text PRIMARY KEY,
      email text NOT NULL,
      ip text NOT NULL,
      attempted_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS login_attempts_email_ip_idx ON login_attempts (email, ip, attempted_at)`;

  await sql`
    CREATE TABLE IF NOT EXISTS addons (
      id text PRIMARY KEY,
      org_id text NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      name text NOT NULL,
      description text,
      requires_approval boolean NOT NULL DEFAULT false,
      active boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS addons_org_idx ON addons (org_id)`;

  await sql`
    CREATE TABLE IF NOT EXISTS booking_series (
      id text PRIMARY KEY,
      org_id text NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      resource_id text NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
      organizer_user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      freq text NOT NULL,
      occurrence_count integer NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id text PRIMARY KEY,
      org_id text NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      resource_id text NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
      organizer_user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      series_id text REFERENCES booking_series(id) ON DELETE SET NULL,
      title text NOT NULL,
      guests jsonb NOT NULL DEFAULT '[]'::jsonb,
      charge_code text,
      status text NOT NULL,
      start_at timestamptz NOT NULL,
      end_at timestamptz NOT NULL,
      checked_in_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS bookings_org_resource_idx ON bookings (org_id, resource_id)`;
  await sql`CREATE INDEX IF NOT EXISTS bookings_org_organizer_idx ON bookings (org_id, organizer_user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS bookings_org_status_idx ON bookings (org_id, status)`;
  await sql`CREATE INDEX IF NOT EXISTS bookings_start_idx ON bookings (start_at)`;

  await sql`
    ALTER TABLE bookings
    ADD COLUMN IF NOT EXISTS during tstzrange
    GENERATED ALWAYS AS (tstzrange(start_at, end_at, '[)')) STORED
  `;

  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'bookings_no_overlap'
      ) THEN
        ALTER TABLE bookings
        ADD CONSTRAINT bookings_no_overlap
        EXCLUDE USING gist (
          resource_id WITH =,
          during WITH &&
        )
        WHERE (status IN ('confirmed', 'pending_approval'));
      END IF;
    END $$
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS booking_addons (
      id text PRIMARY KEY,
      org_id text NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      booking_id text NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      addon_id text NOT NULL REFERENCES addons(id) ON DELETE RESTRICT,
      quantity integer NOT NULL DEFAULT 1,
      fulfillment text NOT NULL DEFAULT 'requested',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS booking_addons_booking_idx ON booking_addons (booking_id)`;

  await sql`
    CREATE TABLE IF NOT EXISTS approvals (
      id text PRIMARY KEY,
      org_id text NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      booking_id text NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      status text NOT NULL DEFAULT 'pending',
      decided_by_user_id text REFERENCES users(id),
      decided_at timestamptz,
      reason text,
      due_at timestamptz NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS approvals_booking_idx ON approvals (booking_id)`;
  await sql`CREATE INDEX IF NOT EXISTS approvals_org_status_idx ON approvals (org_id, status)`;

  await sql`
    CREATE TABLE IF NOT EXISTS kiosk_devices (
      id text PRIMARY KEY,
      org_id text NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      site_id text NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
      name text NOT NULL,
      token_hash text NOT NULL UNIQUE,
      pairing_code_hash text,
      last_seen_at timestamptz,
      revoked_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS kiosk_org_site_idx ON kiosk_devices (org_id, site_id)`;

  await sql`
    CREATE TABLE IF NOT EXISTS audit_events (
      id text PRIMARY KEY,
      org_id text NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      actor_user_id text,
      action text NOT NULL,
      entity text NOT NULL,
      entity_id text,
      payload jsonb NOT NULL DEFAULT '{}'::jsonb,
      ip text,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS audit_org_created_idx ON audit_events (org_id, created_at)`;

  await sql`
    CREATE TABLE IF NOT EXISTS email_outbox (
      id text PRIMARY KEY,
      org_id text NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
      to_email text NOT NULL,
      template text NOT NULL,
      payload jsonb NOT NULL DEFAULT '{}'::jsonb,
      status text NOT NULL DEFAULT 'pending',
      attempts integer NOT NULL DEFAULT 0,
      next_attempt_at timestamptz NOT NULL DEFAULT now(),
      last_error text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS email_outbox_status_idx ON email_outbox (status, next_attempt_at)`;

  console.log("Migrations applied.");
  await sql.end();
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
