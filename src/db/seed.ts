import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "./index";
import {
  addons,
  bookings,
  organizations,
  resources,
  sites,
  users,
} from "./schema";
import { hashPassword } from "../lib/crypto";

const PASSWORD = "atelier-demo-1";

async function seed() {
  const existing = await db
    .select()
    .from(organizations)
    .where(eq(organizations.slug, "northline"))
    .limit(1);
  if (existing[0]) {
    console.log("Seed already applied.");
    process.exit(0);
  }

  const passwordHash = await hashPassword(PASSWORD);

  const [org] = await db
    .insert(organizations)
    .values({
      name: "Northline Partners",
      slug: "northline",
      approvalCapacityThreshold: 8,
      defaultTimezone: "Europe/London",
    })
    .returning();

  const [admin] = await db
    .insert(users)
    .values({
      orgId: org.id,
      email: "maya.chen@northline.example",
      name: "Maya Chen",
      passwordHash,
      role: "org_admin",
    })
    .returning();

  const [facilities] = await db
    .insert(users)
    .values({
      orgId: org.id,
      email: "owen.reid@northline.example",
      name: "Owen Reid",
      passwordHash,
      role: "facilities_admin",
    })
    .returning();

  const [employee] = await db
    .insert(users)
    .values({
      orgId: org.id,
      email: "priya.shah@northline.example",
      name: "Priya Shah",
      passwordHash,
      role: "employee",
    })
    .returning();

  const [site] = await db
    .insert(sites)
    .values({
      orgId: org.id,
      name: "Farringdon House",
      timezone: "Europe/London",
      address: "14 Cowcross Street, London EC1M 6DG",
      kioskEnabled: true,
    })
    .returning();

  const [boardroom] = await db
    .insert(resources)
    .values({
      orgId: org.id,
      siteId: site.id,
      kind: "room",
      name: "Boardroom Alder",
      capacity: 12,
      amenities: ["display", "video", "whiteboard"],
      minLeadMinutes: 30,
      maxDurationMinutes: 240,
      cancelCutoffMinutes: 60,
      requiresCheckin: true,
      checkinGraceMinutes: 10,
    })
    .returning();

  const [huddle] = await db
    .insert(resources)
    .values({
      orgId: org.id,
      siteId: site.id,
      kind: "room",
      name: "Huddle Birch",
      capacity: 4,
      amenities: ["display"],
      minLeadMinutes: 0,
      maxDurationMinutes: 120,
      cancelCutoffMinutes: 15,
      requiresCheckin: true,
      checkinGraceMinutes: 10,
    })
    .returning();

  const [desk] = await db
    .insert(resources)
    .values({
      orgId: org.id,
      siteId: site.id,
      kind: "desk",
      name: "Hot desk 14",
      capacity: 1,
      amenities: ["monitor", "dock"],
      minLeadMinutes: 0,
      maxDurationMinutes: 480,
      cancelCutoffMinutes: 15,
      requiresCheckin: false,
    })
    .returning();

  await db.insert(resources).values([
    {
      orgId: org.id,
      siteId: site.id,
      kind: "parking",
      name: "Bay P-07",
      capacity: 1,
      amenities: ["ev"],
      minLeadMinutes: 60,
      maxDurationMinutes: 720,
      cancelCutoffMinutes: 120,
    },
    {
      orgId: org.id,
      siteId: site.id,
      kind: "locker",
      name: "Locker L-22",
      capacity: 1,
      amenities: [],
      minLeadMinutes: 0,
      maxDurationMinutes: 1440,
      cancelCutoffMinutes: 0,
    },
  ]);

  const [catering] = await db
    .insert(addons)
    .values({
      orgId: org.id,
      name: "Working lunch",
      description: "Sandwiches, fruit, still and sparkling water.",
      requiresApproval: true,
    })
    .returning();

  await db.insert(addons).values({
    orgId: org.id,
    name: "AV technician",
    description: "On-site support for hybrid meetings.",
    requiresApproval: false,
  });

  const start = new Date();
  start.setUTCHours(start.getUTCHours() + 3, 0, 0, 0);
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  await db.insert(bookings).values({
    orgId: org.id,
    resourceId: huddle.id,
    organizerUserId: employee.id,
    title: "Sprint planning",
    guests: [{ name: "Alex Kim" }],
    status: "confirmed",
    startAt: start,
    endAt: end,
  });

  console.log("Seeded Northline Partners.");
  console.log("  Admin:      maya.chen@northline.example / atelier-demo-1");
  console.log("  Facilities: owen.reid@northline.example / atelier-demo-1");
  console.log("  Employee:   priya.shah@northline.example / atelier-demo-1");
  console.log(`  Boardroom:  ${boardroom.name} (${boardroom.id})`);
  console.log(`  Catering:   ${catering.name} (${catering.id})`);
  console.log(`  Admin id:   ${admin.id}`);
  console.log(`  Facilities: ${facilities.id}`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
