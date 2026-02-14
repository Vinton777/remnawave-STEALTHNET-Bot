/**
 * Сервис активации тарифа в Remnawave для конкретного клиента.
 * Используется из: оплата балансом, вебхук Platega, админ mark-as-paid.
 */
export type ActivationResult = {
    ok: true;
} | {
    ok: false;
    error: string;
    status: number;
};
/**
 * Активирует тариф для клиента в Remnawave:
 * - обновляет/создаёт пользователя с expireAt, trafficLimit, deviceLimit
 * - назначает activeInternalSquads
 * - При повторной покупке ДОБАВЛЯЕТ дни к текущему сроку подписки
 */
export declare function activateTariffForClient(client: {
    id: string;
    remnawaveUuid: string | null;
    email: string | null;
    telegramId: string | null;
}, tariff: {
    durationDays: number;
    trafficLimitBytes: bigint | null;
    deviceLimit: number | null;
    internalSquadUuids: string[];
}): Promise<ActivationResult>;
/**
 * Активация тарифа по paymentId — находит клиента и тариф из Payment, вызывает activateTariffForClient.
 */
export declare function activateTariffByPaymentId(paymentId: string): Promise<ActivationResult>;
//# sourceMappingURL=tariff-activation.service.d.ts.map