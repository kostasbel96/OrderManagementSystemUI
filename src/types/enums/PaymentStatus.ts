export const PaymentStatus = {
    UNPAID: "UNPAID",
    PARTIAL: "PARTIAL",
    PAID: "PAID",
} as const;

export type PaymentStatusValue = typeof PaymentStatus[keyof typeof PaymentStatus];

export const paymentStatusConfig: Record<PaymentStatusValue, { bg: string; color: string; border: string; dot: string }> = {
    [PaymentStatus.UNPAID]:  { bg: '#FDECEA', color: '#9B2318', border: '#E57373', dot: '#C62828' },
    [PaymentStatus.PARTIAL]: { bg: '#FAEEDA', color: '#854F0B', border: '#EF9F27', dot: '#BA7517' },
    [PaymentStatus.PAID]:    { bg: '#EAF3DE', color: '#3B6D11', border: '#97C459', dot: '#3B6D11' },
};