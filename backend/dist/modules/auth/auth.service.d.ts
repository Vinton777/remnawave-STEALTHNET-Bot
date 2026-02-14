import type { Env } from "../../config/env.js";
export interface TokenPayload {
    adminId: string;
    email: string;
    type: "access" | "refresh";
}
export declare function hashPassword(password: string): Promise<string>;
export declare function verifyPassword(password: string, hash: string): Promise<boolean>;
export declare function signAccessToken(payload: Omit<TokenPayload, "type">, secret: string, expiresIn: string): string;
export declare function signRefreshToken(payload: Omit<TokenPayload, "type">, secret: string, expiresIn: string): string;
export declare function verifyToken(token: string, secret: string): TokenPayload | null;
export declare function createAdmin(email: string, password: string): Promise<{
    id: string;
    email: string;
    passwordHash: string;
    mustChangePassword: boolean;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function ensureFirstAdmin(env: Env): Promise<{
    id: string;
    email: string;
    passwordHash: string;
    mustChangePassword: boolean;
    role: string;
    createdAt: Date;
    updatedAt: Date;
} | null>;
//# sourceMappingURL=auth.service.d.ts.map