import crypto from 'node:crypto';
import { and, eq, gt } from 'drizzle-orm';
import { db } from '../db/client.js';
import { sessions, users } from '../db/schema.js';
export const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
export async function requireAuth(req, res, next) {
    const token = req.cookies?.session;
    if (!token)
        return res.status(401).json({ error: 'Sign in required.' });
    const [row] = await db
        .select({ session: sessions, user: users })
        .from(sessions)
        .innerJoin(users, eq(users.id, sessions.userId))
        .where(and(eq(sessions.tokenHash, hashToken(token)), gt(sessions.expiresAt, new Date())))
        .limit(1);
    if (!row)
        return res
            .status(401)
            .json({ error: 'Session expired. Please sign in again.' });
    req.user = row.user;
    next();
}
