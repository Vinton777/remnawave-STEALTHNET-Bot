import { verifyToken } from "./auth.service.js";
import { env } from "../../config/index.js";
import { prisma } from "../../db.js";
const AUTH_HEADER = "authorization";
const BEARER = "Bearer ";
export async function requireAuth(req, res, next) {
    const raw = req.headers[AUTH_HEADER];
    const token = typeof raw === "string" && raw.startsWith(BEARER) ? raw.slice(BEARER.length) : null;
    if (!token) {
        return res.status(401).json({ message: "Missing or invalid Authorization header" });
    }
    const payload = verifyToken(token, env.JWT_SECRET);
    if (!payload || payload.type !== "access") {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
    try {
        const admin = await prisma.admin.findUnique({ where: { id: payload.adminId } });
        if (!admin) {
            return res.status(401).json({ message: "User not found" });
        }
        req.adminId = admin.id;
        req.adminEmail = admin.email;
        next();
    }
    catch (e) {
        console.error("requireAuth prisma error:", e);
        return res.status(503).json({
            message: "Database error. Check DATABASE_URL and run: npx prisma db push",
        });
    }
}
/** Если токен есть и валиден — добавляет adminId в req, иначе не блокирует (для опционального auth). */
export async function optionalAuth(req, res, next) {
    const raw = req.headers[AUTH_HEADER];
    const token = typeof raw === "string" && raw.startsWith(BEARER) ? raw.slice(BEARER.length) : null;
    if (!token)
        return next();
    const payload = verifyToken(token, env.JWT_SECRET);
    if (!payload || payload.type !== "access")
        return next();
    try {
        const admin = await prisma.admin.findUnique({ where: { id: payload.adminId } });
        if (admin) {
            req.adminId = admin.id;
        }
    }
    catch (e) {
        console.error("optionalAuth prisma error:", e);
    }
    next();
}
//# sourceMappingURL=middleware.js.map