/**
 * Синхронизация клиентов панели с Remna (из Remna и в Remna).
 */
/** Синхронизация из Remna: загружаем пользователей Remna и создаём/обновляем клиентов в нашей БД. */
export declare function syncFromRemna(): Promise<{
    ok: boolean;
    created: number;
    updated: number;
    skipped: number;
    errors: string[];
}>;
/** Синхронизация в Remna: отправляем данные наших клиентов (telegramId, email) в Remna. */
export declare function syncToRemna(): Promise<{
    ok: boolean;
    updated: number;
    errors: string[];
}>;
/** Создать в Remna пользователей для клиентов панели, у которых ещё нет remnawaveUuid. */
export declare function createRemnaUsersForClientsWithoutUuid(): Promise<{
    ok: boolean;
    created: number;
    linked: number;
    errors: string[];
}>;
//# sourceMappingURL=sync.service.d.ts.map