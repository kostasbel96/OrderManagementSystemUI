import {Box, Button, Typography} from "@mui/material";
import OrdersView from "../orders/OrdersView.tsx";
import type {GridRowSelectionModel} from "@mui/x-data-grid";
import type {OrderRow} from "../../types/Types.ts";
import {memo} from "react";

interface RouteOrdersProps {
    columnVisibility: Record<string, boolean>;
    setColumnVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    selectionModel: GridRowSelectionModel;
    setSelectionModel: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>;
    setOrdersRow: React.Dispatch<React.SetStateAction<OrderRow[]>>;
    onAddToRoute: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onClearSelection: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const RouteOrders = memo(({
                         columnVisibility,
                         setColumnVisibility,
                         selectionModel,
                         setSelectionModel,
                         setOrdersRow,
                         onAddToRoute,
                         onClearSelection}: RouteOrdersProps) => {

    return (
            <Box
                sx={{
                    width: "66%",
                    borderRight: "1px solid #e5e7eb",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Orders
                </Typography>

                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        overflow: "hidden",
                    }}
                >
                    <OrdersView
                        columnVisibility={columnVisibility}
                        setColumnVisibility={setColumnVisibility}
                        selectionModel={selectionModel}
                        setSelectionModel={setSelectionModel}
                        setOrdersRow={setOrdersRow}
                        selection={true}
                        height={"55vh"}
                        width={400}
                    />

                </Box>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        mt: 1,
                        alignItems: "center",
                    }}
                >
                    <Button
                        onClick={onAddToRoute}
                        variant="contained"
                        disabled={selectionModel.ids.size === 0}
                        size="small"
                        sx={{
                            textTransform: "none",
                            borderRadius: 1,
                            backgroundColor: "#1976d2", // blue
                            '&:hover': {
                                backgroundColor: "#1565c0",
                            }
                        }}
                    >
                        Add to Route ({selectionModel.ids.size})
                    </Button>

                    <Button
                        onClick={onClearSelection}
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{
                            textTransform: "none",
                            borderRadius: 1,
                        }}
                    >
                        Clear selection ({selectionModel.ids.size})
                    </Button>
                </Box>
            </Box>
    );

});

export default RouteOrders;