import { Request, Response, NextFunction } from "express";
export declare function requireAuth(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/** Если токен есть и валиден — добавляет adminId в req, иначе не блокирует (для опционального auth). */
export declare function optionalAuth(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=middleware.d.ts.map