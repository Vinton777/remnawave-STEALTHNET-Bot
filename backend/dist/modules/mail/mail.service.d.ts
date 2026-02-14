/**
 * Отправка писем через SMTP (подтверждение регистрации по email)
 */
export type SmtpConfig = {
    host: string;
    port: number;
    secure: boolean;
    user: string | null;
    password: string | null;
    fromEmail: string | null;
    fromName: string | null;
};
export declare function isSmtpConfigured(config: SmtpConfig): boolean;
/**
 * Отправить письмо с ссылкой для подтверждения регистрации
 */
export declare function sendVerificationEmail(config: SmtpConfig, to: string, verificationLink: string, serviceName: string): Promise<{
    ok: boolean;
    error?: string;
}>;
//# sourceMappingURL=mail.service.d.ts.map