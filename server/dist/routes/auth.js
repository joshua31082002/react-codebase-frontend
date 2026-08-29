import crypto from 'node:crypto';
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { sessions, users } from '../db/schema.js';
import { credentialsSchema } from '../validation/schemas.js';
import { hashToken, requireAuth, } from '../middleware/auth.js';
const router = Router();
const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 14,
};
async function createSession(userId, res) {
    const token = crypto.randomBytes(32).toString('hex');
    await db.insert(sessions).values({
        userId,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + cookieOptions.maxAge),
    });
    res.cookie('session', token, cookieOptions);
}
router.post('/register', async (req, res, next) => {
    try {
        const parsed = credentialsSchema
            .extend({ name: credentialsSchema.shape.name.unwrap() })
            .safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({
                error: 'Enter a name, valid email, and password of at least 8 characters.',
            });
        const existing = await db
            .select()
            .from(users)
            .where(eq(users.email, parsed.data.email.toLowerCase()))
            .limit(1);
        if (existing.length)
            return res
                .status(409)
                .json({ error: 'Unable to create account with those details.' });
        const [user] = await db
            .insert(users)
            .values({
            name: parsed.data.name,
            email: parsed.data.email.toLowerCase(),
            passwordHash: await bcrypt.hash(parsed.data.password, 12),
        })
            .returning({ id: users.id, name: users.name, email: users.email });
        await createSession(user.id, res);
        res.status(201).json({ user });
    }
    catch (error) {
        next(error);
    }
});
router.post('/login', async (req, res, next) => {
    try {
        const parsed = credentialsSchema.omit({ name: true }).safeParse(req.body);
        if (!parsed.success)
            return res
                .status(400)
                .json({ error: 'Enter a valid email and password.' });
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, parsed.data.email.toLowerCase()))
            .limit(1);
        if (!user ||
            !(await bcrypt.compare(parsed.data.password, user.passwordHash)))
            return res.status(401).json({ error: 'Invalid email or password.' });
        await createSession(user.id, res);
        res.json({ user: { id: user.id, name: user.name, email: user.email } });
    }
    catch (error) {
        next(error);
    }
});
router.post('/logout', async (req, res, next) => {
    try {
        const token = req.cookies?.session;
        if (token)
            await db.delete(sessions).where(eq(sessions.tokenHash, hashToken(token)));
        res.clearCookie('session');
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
router.get('/me', requireAuth, (req, res) => res.json({
    user: { id: req.user.id, name: req.user.name, email: req.user.email },
}));
export default router;
