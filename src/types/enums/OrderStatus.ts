export const OrderStatus = {
    PENDING:   "PENDING",
    SHIPPED:   "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
} as const;

type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export type OrderStatusValue = typeof OrderStatus[keyof typeof OrderStatus];

export const orderStatusConfig: Record<OrderStatusValue, { bg: string; color: string; border: string; dot: string }> = {
    [OrderStatus.PENDING]:   { bg: '#FAEEDA', color: '#854F0B', border: '#EF9F27', dot: '#BA7517' },
    [OrderStatus.SHIPPED]:   { bg: '#E6F1FB', color: '#0C447C', border: '#85B7EB', dot: '#185FA5' },
    [OrderStatus.DELIVERED]: { bg: '#EAF3DE', color: '#3B6D11', border: '#97C459', dot: '#3B6D11' },
    [OrderStatus.CANCELLED]: { bg: '#F1EFE8', color: '#5F5E5A', border: '#B4B2A9', dot: '#5F5E5A' },
};