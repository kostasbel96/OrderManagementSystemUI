export const RouteStatus = {
    PLANNED: "PLANNED",
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
} as const;

type RouteStatus =
    typeof RouteStatus[keyof typeof RouteStatus];

export type RouteStatusValue = typeof RouteStatus[keyof typeof RouteStatus];

export const statusConfig: Record<RouteStatusValue, { bg: string; color: string; border: string; dot: string }> = {
    [RouteStatus.PLANNED]:     { bg: '#E6F1FB', color: '#0C447C', border: '#85B7EB', dot: '#185FA5' },
    [RouteStatus.IN_PROGRESS]: { bg: '#FAEEDA', color: '#854F0B', border: '#EF9F27', dot: '#BA7517' },
    [RouteStatus.COMPLETED]:   { bg: '#EAF3DE', color: '#3B6D11', border: '#97C459', dot: '#3B6D11' },
    [RouteStatus.CANCELLED]:   { bg: '#F1EFE8', color: '#5F5E5A', border: '#B4B2A9', dot: '#5F5E5A' },
};