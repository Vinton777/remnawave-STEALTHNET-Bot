/**
 * STEALTHNET 3.0 — API клиент бота (вызовы бэкенда).
 */
const API_URL = (process.env.API_URL || "").replace(/\/$/, "");
if (!API_URL) {
    console.warn("API_URL not set in .env — bot API calls will fail");
}
function getHeaders(token) {
    const h = { "Content-Type": "application/json" };
    if (token)
        h["Authorization"] = `Bearer ${token}`;
    return h;
}
async function fetchJson(path, opts) {
    const res = await fetch(`${API_URL}${path}`, {
        method: opts?.method ?? "GET",
        headers: getHeaders(opts?.token),
        ...(opts?.body !== undefined && { body: JSON.stringify(opts.body) }),
    });
    const data = (await res.json().catch(() => ({})));
    if (!res.ok) {
        const msg = typeof data.message === "string" ? data.message : `HTTP ${res.status}`;
        throw new Error(msg);
    }
    return data;
}
/** Публичный конфиг (тарифы, кнопки, способы оплаты, trial и т.д.) */
export async function getPublicConfig() {
    return fetchJson("/api/public/config");
}
/** Регистрация / вход по Telegram */
export async function registerByTelegram(body) {
    return fetchJson("/api/client/auth/register", { method: "POST", body });
}
/** Текущий пользователь */
export async function getMe(token) {
    return fetchJson("/api/client/auth/me", { token });
}
/** Подписка Remna (для ссылки VPN, статус, трафик) + отображаемое имя тарифа с сайта */
export async function getSubscription(token) {
    return fetchJson("/api/client/subscription", { token });
}
/** Публичный список тарифов по категориям (emoji из админки по коду ordinary/premium) */
export async function getPublicTariffs() {
    return fetchJson("/api/public/tariffs");
}
/** Создать платёж Platega (возвращает paymentUrl) */
export async function createPlategaPayment(token, body) {
    return fetchJson("/api/client/payments/platega", { method: "POST", body, token });
}
/** Обновить профиль (язык, валюта) */
export async function updateProfile(token, body) {
    return fetchJson("/api/client/profile", { method: "PATCH", body, token });
}
/** Активировать триал */
export async function activateTrial(token) {
    return fetchJson("/api/client/trial", { method: "POST", body: {}, token });
}
/** Оплата тарифа балансом */
export async function payByBalance(token, tariffId) {
    return fetchJson("/api/client/payments/balance", { method: "POST", body: { tariffId }, token });
}
/** Активировать промо-ссылку (PromoGroup) */
export async function activatePromo(token, code) {
    return fetchJson("/api/client/promo/activate", { method: "POST", body: { code }, token });
}
/** Проверить промокод (PromoCode — скидка / бесплатные дни) */
export async function checkPromoCode(token, code) {
    return fetchJson("/api/client/promo-code/check", { method: "POST", body: { code }, token });
}
/** Активировать промокод FREE_DAYS */
export async function activatePromoCode(token, code) {
    return fetchJson("/api/client/promo-code/activate", { method: "POST", body: { code }, token });
}
