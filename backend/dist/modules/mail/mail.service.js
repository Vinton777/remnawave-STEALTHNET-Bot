/**
 * Отправка писем через SMTP (подтверждение регистрации по email)
 */
import nodemailer from "nodemailer";
export function isSmtpConfigured(config) {
    return Boolean(config.host &&
        config.port &&
        config.fromEmail);
}
/**
 * Отправить письмо с ссылкой для подтверждения регистрации
 */
export async function sendVerificationEmail(config, to, verificationLink, serviceName) {
    if (!isSmtpConfigured(config)) {
        return { ok: false, error: "SMTP not configured" };
    }
    const auth = config.user && config.password ? { user: config.user, pass: config.password } : undefined;
    const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth,
    });
    const from = config.fromName
        ? `"${config.fromName}" <${config.fromEmail}>`
        : config.fromEmail;
    const subject = `Подтверждение регистрации — ${serviceName}`;
    const html = `
    <p>Здравствуйте!</p>
    <p>Для завершения регистрации в ${serviceName} перейдите по ссылке:</p>
    <p><a href="${verificationLink}">${verificationLink}</a></p>
    <p>Ссылка действительна 24 часа.</p>
    <p>Если вы не регистрировались, проигнорируйте это письмо.</p>
  `;
    try {
        await transporter.sendMail({
            from,
            to,
            subject,
            html,
        });
        return { ok: true };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { ok: false, error: message };
    }
}
//# sourceMappingURL=mail.service.js.map