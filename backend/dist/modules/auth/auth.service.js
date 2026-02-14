import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../db.js";
const SALT_ROUNDS = 12;
export async function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}
export async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}
export function signAccessToken(payload, secret, expiresIn) {
    return jwt.sign({ ...payload, type: "access" }, secret, { expiresIn });
}
export function signRefreshToken(payload, secret, expiresIn) {
    return jwt.sign({ ...payload, type: "refresh" }, secret, { expiresIn });
}
export function verifyToken(token, secret) {
    try {
        const decoded = jwt.verify(token, secret);
        return decoded;
    }
    catch {
        return null;
    }
}
export async function createAdmin(email, password) {
    const passwordHash = await hashPassword(password);
    return prisma.admin.create({
        data: {
            email,
            passwordHash,
            mustChangePassword: true,
            role: "ADMIN",
        },
    });
}
export async function ensureFirstAdmin(env) {
    const count = await prisma.admin.count();
    if (count > 0)
        return null;
    const email = process.env.INIT_ADMIN_EMAIL ?? "admin@stealthnet.local";
    const rawPassword = process.env.INIT_ADMIN_PASSWORD ?? generateRandomPassword();
    const admin = await createAdmin(email, rawPassword);
    if (!process.env.INIT_ADMIN_PASSWORD) {
        console.log("========================================");
        console.log("STEALTHNET 3.0 — первый админ создан");
        console.log("Email:", email);
        console.log("Пароль (сохраните и смените в админке):", rawPassword);
        console.log("========================================");
    }
    return admin;
}
function generateRandomPassword() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let s = "";
    for (let i = 0; i < 16; i++)
        s += chars[Math.floor(Math.random() * chars.length)];
    return s;
}
//# sourceMappingURL=auth.service.js.map