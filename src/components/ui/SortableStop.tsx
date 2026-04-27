import { Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { OrderRow } from "../../types/Types.ts";

export function SortableStop({
                                 order,
                                 index,
                                 onDelete,
                             }: Readonly<{
    order: OrderRow;
    index: number;
    onDelete: (id: number) => void;
}>) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: Number(order.id) });

    return (
        <Box
            ref={setNodeRef}
            {...attributes}
            sx={{
                position: "relative",
                p: 0.5,
                border: "1px solid #e5e7eb",
                borderRadius: 1,
                backgroundColor: isDragging ? "#f3f4f6" : "#fff",
                transition,
                transform: CSS.Transform.toString(transform),
                userSelect: "none",
            }}
        >
            {/* DELETE */}
            <DeleteIcon
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => onDelete(Number(order.id))}
                sx={{
                    position: "absolute",
                    top: 2,
                    right: 4,
                    fontSize: 14,
                    color: "#ef4444",
                    cursor: "pointer",
                    opacity: 0.6,
                    "&:hover": { opacity: 1 },
                }}
            />

            {/* MAIN ROW */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    fontSize: 11,
                    width: "100%",
                }}
            >
                {/* LEFT SIDE (drag + index) */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        minWidth: 24,
                    }}
                >
                    <Box
                        {...listeners}
                        sx={{
                            cursor: "grab",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <DragIndicatorIcon sx={{ fontSize: 14, color: "#9ca3af" }} />
                    </Box>

                    <Box sx={{ color: "#9ca3af", fontSize: 10 }}>
                        {index + 1}
                    </Box>
                </Box>

                {/* RIGHT SIDE (stacked info) */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.3,
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    {/* CUSTOMER */}
                    <Box sx={{ fontWeight: 600 }}>
                        {order.customer?.name} {order.customer?.lastName}
                    </Box>

                    {/* ADDRESS */}
                    <Box
                        sx={{
                            color: "#666",
                            fontSize: 10,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {order.address}
                    </Box>

                    {/* BALANCE */}
                    <Box sx={{ fontSize: 10 }}>
                        Balance: {(order.total ?? 0)}€
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}