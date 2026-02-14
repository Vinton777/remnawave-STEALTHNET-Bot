/**
 * Клиент Remna (RemnaWave) API — по спецификации api-1.yaml
 * Все запросы с Bearer ADMIN_TOKEN.
 */
export declare function isRemnaConfigured(): boolean;
export declare function remnaFetch<T>(path: string, options?: RequestInit): Promise<{
    data?: T;
    error?: string;
    status: number;
}>;
/** GET /api/users — пагинация Remna: size и start (offset) */
export declare function remnaGetUsers(params?: {
    page?: number;
    limit?: number;
    start?: number;
    size?: number;
}): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
/** GET /api/users/{uuid} */
export declare function remnaGetUser(uuid: string): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
/** GET /api/users/by-username/{username} */
export declare function remnaGetUserByUsername(username: string): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
/** GET /api/users/by-email/{email} — может вернуть массив или объект с users */
export declare function remnaGetUserByEmail(email: string): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
/** GET /api/users/by-telegram-id/{telegramId} */
export declare function remnaGetUserByTelegramId(telegramId: string): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
/** Извлечь UUID из ответа Remna (create/get: объект, response, data, users[0]). */
export declare function extractRemnaUuid(d: unknown): string | null;
/** POST /api/users */
export declare function remnaCreateUser(body: Record<string, unknown>): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
/** PATCH /api/users */
export declare function remnaUpdateUser(body: Record<string, unknown>): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
/** GET /api/subscriptions */
export declare function remnaGetSubscriptions(params?: {
    page?: number;
    limit?: number;
}): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
/** GET /api/subscription-templates */
export declare function remnaGetSubscriptionTemplates(): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
/** GET /api/internal-squads, /api/external-squads */
export declare function remnaGetInternalSquads(): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
export declare function remnaGetExternalSquads(): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
/** GET /api/system/stats */
export declare function remnaGetSystemStats(): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
/** GET /api/system/stats/nodes — статистика нод по дням */
export declare function remnaGetSystemStatsNodes(): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
/** GET /api/nodes — список нод (uuid, name, address, isConnected, isDisabled, isConnecting, ...) */
export declare function remnaGetNodes(): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
/** POST /api/nodes/{uuid}/actions/enable */
export declare function remnaEnableNode(uuid: string): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
/** POST /api/nodes/{uuid}/actions/disable */
export declare function remnaDisableNode(uuid: string): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
/** POST /api/nodes/{uuid}/actions/restart */
export declare function remnaRestartNode(uuid: string): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
/** POST /api/users/{uuid}/actions/revoke — отозвать подписку */
export declare function remnaRevokeUserSubscription(uuid: string, body?: {
    expirationDate?: string;
}): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
/** POST /api/users/{uuid}/actions/disable */
export declare function remnaDisableUser(uuid: string): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
/** POST /api/users/{uuid}/actions/enable */
export declare function remnaEnableUser(uuid: string): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
/** POST /api/users/{uuid}/actions/reset-traffic */
export declare function remnaResetUserTraffic(uuid: string): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
/** POST /api/users/bulk/update-squads — uuids + activeInternalSquads */
export declare function remnaBulkUpdateUsersSquads(body: {
    uuids: string[];
    activeInternalSquads: string[];
}): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
/** POST /api/internal-squads/{squadUuid}/bulk-actions/add-users */
export declare function remnaAddUsersToInternalSquad(squadUuid: string, body: {
    userUuids: string[];
}): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
/** DELETE /api/internal-squads/{squadUuid}/bulk-actions/remove-users */
export declare function remnaRemoveUsersFromInternalSquad(squadUuid: string, body: {
    userUuids: string[];
}): Promise<{
    data?: unknown;
    error?: string;
    status: number;
}>;
//# sourceMappingURL=remna.client.d.ts.map