import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { prisma } from "../../db.js";
import { env } from "../../config/index.js";
const SALT_ROUNDS = 12;
export async function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}
export async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}
export function signClientToken(clientId, expiresIn = "7d") {
    return jwt.sign({ clientId, type: "client_access" }, env.JWT_SECRET, { expiresIn });
}
export function verifyClientToken(token) {
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        return decoded?.type === "client_access" ? decoded : null;
    }
    catch {
        return null;
    }
}
export function generateReferralCode() {
    return "REF-" + randomBytes(4).toString("hex").toUpperCase();
}
const SYSTEM_CONFIG_KEYS = [
    "active_languages", "active_currencies", "default_language", "default_currency",
    "default_referral_percent", "referral_percent_level_2", "referral_percent_level_3",
    "trial_days", "trial_squad_uuid", "trial_device_limit", "trial_traffic_limit",
    "service_name", "logo", "favicon", "remna_client_url",
    "smtp_host", "smtp_port", "smtp_secure", "smtp_user", "smtp_password",
    "smtp_from_email", "smtp_from_name", "public_app_url",
    "telegram_bot_token", "telegram_bot_username",
    "platega_merchant_id", "platega_secret", "platega_methods",
    "bot_buttons", "bot_back_label", "bot_menu_texts", "bot_inner_button_styles",
    "bot_emojis", // JSON: { "TRIAL": { "unicode": "🎁", "tgEmojiId": "..." }, "PACKAGE": ... } — эмодзи кнопок/текста, TG ID для премиум
    "category_emojis", // JSON: { "ordinary": "📦", "premium": "⭐" } — эмодзи категорий по коду
    "subscription_page_config",
    "support_link", "agreement_link", "offer_link", "instructions_link", // Поддержка: тех поддержка, соглашения, оферта, инструкции
];
const DEFAULT_BOT_BUTTONS = [
    { id: "tariffs", visible: true, label: "📦 Тарифы", order: 0, style: "success" },
    { id: "profile", visible: true, label: "👤 Профиль", order: 1, style: "" },
    { id: "topup", visible: true, label: "💳 Пополнить баланс", order: 2, style: "success" },
    { id: "referral", visible: true, label: "🔗 Реферальная программа", order: 3, style: "primary" },
    { id: "trial", visible: true, label: "🎁 Попробовать бесплатно", order: 4, style: "success" },
    { id: "vpn", visible: true, label: "🌐 Подключиться к VPN", order: 5, style: "danger" },
    { id: "cabinet", visible: true, label: "🌐 Web Кабинет", order: 6, style: "primary" },
    { id: "support", visible: true, label: "🆘 Поддержка", order: 7, style: "primary" },
    { id: "promocode", visible: true, label: "🎟️ Промокод", order: 8, style: "primary" },
];
const DEFAULT_BOT_MENU_TEXTS = {
    welcomeTitlePrefix: "🛡 ",
    welcomeGreeting: "👋 Добро пожаловать в ",
    balancePrefix: "💰 Баланс: ",
    tariffPrefix: "💎 Ваш тариф : ",
    subscriptionPrefix: "📊 Статус подписки — ",
    statusInactive: "🔴 Истекла",
    statusActive: "🟡 Активна",
    statusExpired: "🔴 Истекла",
    statusLimited: "🟡 Ограничена",
    statusDisabled: "🔴 Отключена",
    expirePrefix: "📅 до ",
    daysLeftPrefix: "⏰ осталось ",
    devicesLabel: "📱 Устройств: ",
    devicesAvailable: " доступно",
    trafficPrefix: "📈 Трафик — ",
    linkLabel: "🔗 Ссылка подключения:",
    chooseAction: "Выберите действие:",
};
const DEFAULT_BOT_INNER_BUTTON_STYLES = {
    tariffPay: "success",
    topup: "primary",
    back: "danger",
    profile: "primary",
    trialConfirm: "success",
    lang: "primary",
    currency: "primary",
};
function parseBotInnerButtonStyles(raw) {
    if (!raw || !raw.trim())
        return { ...DEFAULT_BOT_INNER_BUTTON_STYLES };
    try {
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object")
            return { ...DEFAULT_BOT_INNER_BUTTON_STYLES };
        const out = { ...DEFAULT_BOT_INNER_BUTTON_STYLES };
        for (const k of Object.keys(DEFAULT_BOT_INNER_BUTTON_STYLES)) {
            if (typeof parsed[k] === "string" && ["primary", "success", "danger", ""].includes(parsed[k])) {
                out[k] = parsed[k]; // сохраняем "" как «без стиля», не подменяем дефолтом
            }
        }
        return out;
    }
    catch {
        return { ...DEFAULT_BOT_INNER_BUTTON_STYLES };
    }
}
function parseBotMenuTexts(raw) {
    if (!raw || !raw.trim())
        return { ...DEFAULT_BOT_MENU_TEXTS };
    try {
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object")
            return { ...DEFAULT_BOT_MENU_TEXTS };
        const out = { ...DEFAULT_BOT_MENU_TEXTS };
        for (const k of Object.keys(DEFAULT_BOT_MENU_TEXTS)) {
            if (typeof parsed[k] === "string")
                out[k] = parsed[k];
        }
        return out;
    }
    catch {
        return { ...DEFAULT_BOT_MENU_TEXTS };
    }
}
function parseBotButtons(raw) {
    if (!raw || !raw.trim())
        return DEFAULT_BOT_BUTTONS;
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed))
            return DEFAULT_BOT_BUTTONS;
        const result = parsed.map((x, i) => {
            const o = x;
            const id = typeof o.id === "string" ? o.id : String(o.id ?? "button");
            const def = DEFAULT_BOT_BUTTONS.find((d) => d.id === id) ?? { label: id, order: i, style: "" };
            return {
                id,
                visible: typeof o.visible === "boolean" ? o.visible : true,
                label: typeof o.label === "string" && o.label.trim() ? o.label.trim() : def.label,
                order: typeof o.order === "number" ? o.order : (typeof o.order === "string" ? parseInt(o.order, 10) : i),
                style: typeof o.style === "string" ? o.style : def.style ?? "",
                emojiKey: typeof o.emojiKey === "string" && o.emojiKey.trim() ? o.emojiKey.trim() : undefined,
            };
        });
        // Дополняем кнопками из дефолтов, которых нет в сохранённом списке
        const savedIds = new Set(result.map((b) => b.id));
        for (const def of DEFAULT_BOT_BUTTONS) {
            if (!savedIds.has(def.id)) {
                result.push({ id: def.id, visible: def.visible, label: def.label, order: def.order, style: def.style ?? "", emojiKey: undefined });
            }
        }
        return result;
    }
    catch {
        return DEFAULT_BOT_BUTTONS;
    }
}
function parseBotEmojis(raw) {
    if (!raw || !raw.trim())
        return {};
    try {
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object")
            return {};
        const out = {};
        for (const [key, val] of Object.entries(parsed)) {
            if (val == null)
                continue;
            if (typeof val === "string" && val.trim()) {
                out[key] = { unicode: val.trim() };
                continue;
            }
            if (typeof val !== "object")
                continue;
            const v = val;
            const unicode = typeof v.unicode === "string" ? v.unicode.trim() : undefined;
            const tgEmojiId = typeof v.tgEmojiId === "string" ? v.tgEmojiId.trim() : (typeof v.tgEmojiId === "number" ? String(v.tgEmojiId) : undefined);
            if (unicode || tgEmojiId)
                out[key] = { unicode, tgEmojiId };
        }
        return out;
    }
    catch {
        return {};
    }
}
export async function getSystemConfig() {
    const settings = await prisma.systemSetting.findMany({
        where: { key: { in: SYSTEM_CONFIG_KEYS } },
    });
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    const activeLangs = (map.active_languages || "ru,ua,en").split(",").map((s) => s.trim());
    const activeCurrs = (map.active_currencies || "usd,uah,rub").split(",").map((s) => s.trim());
    return {
        activeLanguages: activeLangs,
        activeCurrencies: activeCurrs,
        defaultLanguage: map.default_language && activeLangs.includes(map.default_language) ? map.default_language : activeLangs[0] ?? "ru",
        defaultCurrency: map.default_currency && activeCurrs.includes(map.default_currency) ? map.default_currency : activeCurrs[0] ?? "usd",
        defaultReferralPercent: parseFloat(map.default_referral_percent || "30"),
        referralPercentLevel2: parseFloat(map.referral_percent_level_2 || "10"),
        referralPercentLevel3: parseFloat(map.referral_percent_level_3 || "10"),
        trialDays: parseInt(map.trial_days || "3", 10),
        trialSquadUuid: map.trial_squad_uuid || null,
        trialDeviceLimit: map.trial_device_limit != null && map.trial_device_limit !== "" ? parseInt(map.trial_device_limit, 10) : null,
        trialTrafficLimitBytes: map.trial_traffic_limit != null && map.trial_traffic_limit !== "" ? parseInt(map.trial_traffic_limit, 10) : null,
        serviceName: map.service_name || "STEALTHNET",
        logo: map.logo || null,
        favicon: map.favicon || null,
        remnaClientUrl: map.remna_client_url || null,
        smtpHost: map.smtp_host || null,
        smtpPort: map.smtp_port != null && map.smtp_port !== "" ? parseInt(map.smtp_port, 10) : 587,
        smtpSecure: map.smtp_secure === "true" || map.smtp_secure === "1",
        smtpUser: map.smtp_user || null,
        smtpPassword: map.smtp_password || null,
        smtpFromEmail: map.smtp_from_email || null,
        smtpFromName: map.smtp_from_name || null,
        publicAppUrl: map.public_app_url || null,
        telegramBotToken: map.telegram_bot_token || null,
        telegramBotUsername: map.telegram_bot_username || null,
        plategaMerchantId: map.platega_merchant_id || null,
        plategaSecret: map.platega_secret || null,
        plategaMethods: parsePlategaMethods(map.platega_methods),
        botButtons: parseBotButtons(map.bot_buttons),
        botEmojis: parseBotEmojis(map.bot_emojis),
        botBackLabel: (map.bot_back_label || "◀️ В меню").trim() || "◀️ В меню",
        botMenuTexts: parseBotMenuTexts(map.bot_menu_texts),
        botInnerButtonStyles: parseBotInnerButtonStyles(map.bot_inner_button_styles),
        categoryEmojis: parseCategoryEmojis(map.category_emojis),
        subscriptionPageConfig: map.subscription_page_config ?? null,
        supportLink: (map.support_link ?? "").trim() || null,
        agreementLink: (map.agreement_link ?? "").trim() || null,
        offerLink: (map.offer_link ?? "").trim() || null,
        instructionsLink: (map.instructions_link ?? "").trim() || null,
    };
}
function parseCategoryEmojis(raw) {
    if (!raw || !raw.trim())
        return { ordinary: "📦", premium: "⭐" };
    try {
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object")
            return { ordinary: "📦", premium: "⭐" };
        const out = {};
        for (const [k, v] of Object.entries(parsed)) {
            if (typeof v === "string" && v.trim())
                out[k] = v.trim();
        }
        if (Object.keys(out).length === 0)
            return { ordinary: "📦", premium: "⭐" };
        return out;
    }
    catch {
        return { ordinary: "📦", premium: "⭐" };
    }
}
const DEFAULT_PLATEGA_METHODS = [
    { id: 2, enabled: true, label: "СПБ" },
    { id: 11, enabled: false, label: "Карты" },
    { id: 12, enabled: false, label: "Международный" },
    { id: 13, enabled: false, label: "Криптовалюта" },
];
function parsePlategaMethods(raw) {
    if (!raw || !raw.trim())
        return DEFAULT_PLATEGA_METHODS;
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed))
            return DEFAULT_PLATEGA_METHODS;
        return parsed.map((m) => {
            const x = m;
            return {
                id: typeof x.id === "number" ? x.id : Number(x.id) || 2,
                enabled: Boolean(x.enabled),
                label: typeof x.label === "string" ? x.label : String(x.id),
            };
        });
    }
    catch {
        return DEFAULT_PLATEGA_METHODS;
    }
}
/** Публичный конфиг для сайта/бота (без паролей и секретов). botButtons с подставленными эмодзи. */
export async function getPublicConfig() {
    const full = await getSystemConfig();
    const trialDays = full.trialDays ?? 0;
    const trialEnabled = trialDays > 0 && Boolean(full.trialSquadUuid?.trim());
    const botEmojis = full.botEmojis ?? {};
    const defaultEmojiKeyByButtonId = {
        trial: "TRIAL", tariffs: "PACKAGE", profile: "PUZZLE", topup: "CARD", referral: "LINK", vpn: "SERVERS", cabinet: "SERVERS",
    };
    const resolvedButtons = (full.botButtons ?? []).map((b) => {
        const emojiKey = b.emojiKey ?? defaultEmojiKeyByButtonId[b.id];
        const entry = emojiKey ? botEmojis[emojiKey] : undefined;
        let label = b.label;
        let iconCustomEmojiId;
        if (entry) {
            if (entry.tgEmojiId)
                iconCustomEmojiId = entry.tgEmojiId;
            if (entry.unicode && !entry.tgEmojiId)
                label = (entry.unicode + " " + label).trim();
        }
        return { id: b.id, visible: b.visible, label, order: b.order, style: b.style, iconCustomEmojiId };
    });
    const menuTexts = full.botMenuTexts ?? DEFAULT_BOT_MENU_TEXTS;
    const resolvedBotMenuTexts = {};
    const menuTextCustomEmojiIds = {};
    for (const [k, v] of Object.entries(menuTexts)) {
        let s = String(v ?? "");
        for (const [ek, ev] of Object.entries(botEmojis)) {
            const placeholder = "{{" + ek + "}}";
            if (s.includes(placeholder))
                s = s.split(placeholder).join(ev.unicode ?? "").trim();
        }
        resolvedBotMenuTexts[k] = s;
        // Если строка начинается с unicode эмодзи, у которого есть tgEmojiId — передаём ID для entities в сообщении
        for (const [ek, ev] of Object.entries(botEmojis)) {
            if (ev.tgEmojiId && ev.unicode && s.startsWith(ev.unicode)) {
                menuTextCustomEmojiIds[k] = ev.tgEmojiId;
                break;
            }
        }
    }
    return {
        activeLanguages: full.activeLanguages,
        activeCurrencies: full.activeCurrencies,
        defaultLanguage: full.defaultLanguage,
        defaultCurrency: full.defaultCurrency,
        serviceName: full.serviceName,
        logo: full.logo,
        favicon: full.favicon,
        remnaClientUrl: full.remnaClientUrl,
        publicAppUrl: full.publicAppUrl,
        telegramBotUsername: full.telegramBotUsername,
        plategaMethods: full.plategaMethods.filter((m) => m.enabled).map((m) => ({ id: m.id, label: m.label })),
        trialEnabled,
        trialDays,
        botButtons: resolvedButtons,
        botBackLabel: full.botBackLabel,
        botMenuTexts: menuTexts,
        resolvedBotMenuTexts,
        menuTextCustomEmojiIds,
        botEmojis,
        botInnerButtonStyles: full.botInnerButtonStyles ?? DEFAULT_BOT_INNER_BUTTON_STYLES,
        categoryEmojis: full.categoryEmojis,
        defaultReferralPercent: full.defaultReferralPercent ?? 0,
        referralPercentLevel2: full.referralPercentLevel2 ?? 0,
        referralPercentLevel3: full.referralPercentLevel3 ?? 0,
        supportLink: full.supportLink ?? null,
        agreementLink: full.agreementLink ?? null,
        offerLink: full.offerLink ?? null,
        instructionsLink: full.instructionsLink ?? null,
    };
}
//# sourceMappingURL=client.service.js.map