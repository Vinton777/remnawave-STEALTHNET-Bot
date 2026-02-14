/**
 * Клиент Remna (RemnaWave) API — по спецификации api-1.yaml
 * Все запросы с Bearer ADMIN_TOKEN.
 */
import { env } from "../../config/index.js";
const REMNA_API_URL = env.REMNA_API_URL?.replace(/\/$/, "") ?? "";
const REMNA_ADMIN_TOKEN = env.REMNA_ADMIN_TOKEN ?? "";
export function isRemnaConfigured() {
    return Boolean(REMNA_API_URL && REMNA_ADMIN_TOKEN);
}
function getHeaders() {
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${REMNA_ADMIN_TOKEN}`,
    };
}
export async function remnaFetch(path, options = {}) {
    if (!isRemnaConfigured()) {
        return { error: "Remna API not configured", status: 503 };
    }
    const url = `${REMNA_API_URL}${path.startsWith("/") ? path : `/${path}`}`;
    try {
        const res = await fetch(url, {
            ...options,
            headers: { ...getHeaders(), ...options.headers },
        });
        const text = await res.text();
        let data;
        if (text) {
            try {
                data = JSON.parse(text);
            }
            catch {
                // non-JSON response
            }
        }
        if (!res.ok) {
            return {
                error: data?.message ?? res.statusText ?? text.slice(0, 200),
                status: res.status,
            };
        }
        return { data: data, status: res.status };
    }
    catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        return { error: message, status: 500 };
    }
}
/** GET /api/users — пагинация Remna: size и start (offset) */
export function remnaGetUsers(params) {
    const search = new URLSearchParams();
    if (params?.size != null)
        search.set("size", String(params.size));
    else if (params?.limit != null)
        search.set("size", String(params.limit));
    if (params?.start != null)
        search.set("start", String(params.start));
    else if (params?.page != null && params?.limit != null)
        search.set("start", String((params.page - 1) * params.limit));
    const q = search.toString();
    return remnaFetch(`/api/users${q ? `?${q}` : ""}`);
}
/** GET /api/users/{uuid} */
export function remnaGetUser(uuid) {
    return remnaFetch(`/api/users/${uuid}`);
}
/** GET /api/users/by-username/{username} */
export function remnaGetUserByUsername(username) {
    const encoded = encodeURIComponent(username);
    return remnaFetch(`/api/users/by-username/${encoded}`);
}
/** GET /api/users/by-email/{email} — может вернуть массив или объект с users */
export function remnaGetUserByEmail(email) {
    const encoded = encodeURIComponent(email);
    return remnaFetch(`/api/users/by-email/${encoded}`);
}
/** GET /api/users/by-telegram-id/{telegramId} */
export function remnaGetUserByTelegramId(telegramId) {
    const encoded = encodeURIComponent(telegramId);
    return remnaFetch(`/api/users/by-telegram-id/${encoded}`);
}
/** Извлечь UUID из ответа Remna (create/get: объект, response, data, users[0]). */
export function extractRemnaUuid(d) {
    if (!d || typeof d !== "object")
        return null;
    const o = d;
    if (typeof o.uuid === "string")
        return o.uuid;
    const resp = (o.response ?? o.data);
    if (resp && typeof resp.uuid === "string")
        return resp.uuid;
    const users = Array.isArray(o.users) ? o.users : Array.isArray(o.response) ? o.response : Array.isArray(o.data) ? o.data : null;
    const first = users?.[0];
    return first && typeof first === "object" && first !== null && typeof first.uuid === "string"
        ? first.uuid
        : null;
}
/** POST /api/users */
export function remnaCreateUser(body) {
    return remnaFetch("/api/users", { method: "POST", body: JSON.stringify(body) });
}
/** PATCH /api/users */
export function remnaUpdateUser(body) {
    return remnaFetch("/api/users", { method: "PATCH", body: JSON.stringify(body) });
}
/** GET /api/subscriptions */
export function remnaGetSubscriptions(params) {
    const search = new URLSearchParams();
    if (params?.page != null)
        search.set("page", String(params.page));
    if (params?.limit != null)
        search.set("limit", String(params.limit));
    const q = search.toString();
    return remnaFetch(`/api/subscriptions${q ? `?${q}` : ""}`);
}
/** GET /api/subscription-templates */
export function remnaGetSubscriptionTemplates() {
    return remnaFetch("/api/subscription-templates");
}
/** GET /api/internal-squads, /api/external-squads */
export function remnaGetInternalSquads() {
    return remnaFetch("/api/internal-squads");
}
export function remnaGetExternalSquads() {
    return remnaFetch("/api/external-squads");
}
/** GET /api/system/stats */
export function remnaGetSystemStats() {
    return remnaFetch("/api/system/stats");
}
/** GET /api/system/stats/nodes — статистика нод по дням */
export function remnaGetSystemStatsNodes() {
    return remnaFetch("/api/system/stats/nodes");
}
/** GET /api/nodes — список нод (uuid, name, address, isConnected, isDisabled, isConnecting, ...) */
export function remnaGetNodes() {
    return remnaFetch("/api/nodes");
}
/** POST /api/nodes/{uuid}/actions/enable */
export function remnaEnableNode(uuid) {
    return remnaFetch(`/api/nodes/${uuid}/actions/enable`, { method: "POST" });
}
/** POST /api/nodes/{uuid}/actions/disable */
export function remnaDisableNode(uuid) {
    return remnaFetch(`/api/nodes/${uuid}/actions/disable`, { method: "POST" });
}
/** POST /api/nodes/{uuid}/actions/restart */
export function remnaRestartNode(uuid) {
    return remnaFetch(`/api/nodes/${uuid}/actions/restart`, { method: "POST" });
}
/** POST /api/users/{uuid}/actions/revoke — отозвать подписку */
export function remnaRevokeUserSubscription(uuid, body) {
    return remnaFetch(`/api/users/${uuid}/actions/revoke`, {
        method: "POST",
        body: body ? JSON.stringify(body) : "{}",
    });
}
/** POST /api/users/{uuid}/actions/disable */
export function remnaDisableUser(uuid) {
    return remnaFetch(`/api/users/${uuid}/actions/disable`, { method: "POST" });
}
/** POST /api/users/{uuid}/actions/enable */
export function remnaEnableUser(uuid) {
    return remnaFetch(`/api/users/${uuid}/actions/enable`, { method: "POST" });
}
/** POST /api/users/{uuid}/actions/reset-traffic */
export function remnaResetUserTraffic(uuid) {
    return remnaFetch(`/api/users/${uuid}/actions/reset-traffic`, { method: "POST" });
}
/** POST /api/users/bulk/update-squads — uuids + activeInternalSquads */
export function remnaBulkUpdateUsersSquads(body) {
    return remnaFetch("/api/users/bulk/update-squads", {
        method: "POST",
        body: JSON.stringify(body),
    });
}
/** POST /api/internal-squads/{squadUuid}/bulk-actions/add-users */
export function remnaAddUsersToInternalSquad(squadUuid, body) {
    return remnaFetch(`/api/internal-squads/${squadUuid}/bulk-actions/add-users`, {
        method: "POST",
        body: JSON.stringify(body),
    });
}
/** DELETE /api/internal-squads/{squadUuid}/bulk-actions/remove-users */
export function remnaRemoveUsersFromInternalSquad(squadUuid, body) {
    return remnaFetch(`/api/internal-squads/${squadUuid}/bulk-actions/remove-users`, {
        method: "DELETE",
        body: JSON.stringify(body),
    });
}
//# sourceMappingURL=remna.client.js.map