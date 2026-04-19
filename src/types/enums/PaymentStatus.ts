export const PaymentStatus = {
    UNPAID: "UNPAID",
    PARTIAL: "PARTIAL",
    PAID: "PAID",
} as const;

export type PaymentStatus =
    typeof PaymentStatus[keyof typeof PaymentStatus];