import OrdersView from "../orders/OrdersView.tsx";
import {Box, Button, Divider, Grid, Paper, Stack, TextField, Typography} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import type {OrderRow} from "../../types/Types.ts";
import {arrayMove, SortableContext} from "@dnd-kit/sortable";
import {DndContext} from "@dnd-kit/core";
import {SortableStop} from "../ui/SortableStop.tsx";
import type {GridRowSelectionModel} from "@mui/x-data-grid";

const CreateRoute = () => {
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        actions: false,
    });

    const [selectionModel, setSelectionModel] =
        useState<GridRowSelectionModel>({
            type: "include",
            ids: new Set(),
        });

    const [ordersRow, setOrdersRow] = useState<OrderRow[]>([]);
    const [stops, setStops] = useState<OrderRow[]>(() => {
        try {
            const data = localStorage.getItem("stops");
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    });

    const ordersMap = useMemo(() => {
        return new Map(ordersRow?.map((o: OrderRow) => [o.id, o]));
    }, [ordersRow]);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = stops.findIndex(s => s.id === active.id);
        const newIndex = stops.findIndex(s => s.id === over.id);

        setStops(prev => arrayMove(prev, oldIndex, newIndex));

    };

    const handleDeleteStop = (id: number) => {
        setStops(prev => prev.filter(s => Number(s.id) !== Number(id)));
        console.log("stops");
    };



    const handleClickAddtoRoute = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!selectionModel) return;
        if (!ordersMap) return;
        const selectedOrders: OrderRow[] = Array.from(selectionModel.ids)
            .map((id) => ordersMap.get(Number(id)))
            .filter((order): order is OrderRow => order !== undefined);

        const newStops = [
            ...stops,
            ...selectedOrders.filter(
                o => !stops.some(s => s.id === o.id)
            )
        ];

        setStops(newStops);
    };

    useEffect(() => {
        localStorage.setItem("stops", JSON.stringify(stops));
        console.log(stops);
    }, [stops]);

    const labelSx = {
        width: "fit-content",
        padding: "6px",
        border: "1px solid #bdbdbd",
        borderRadius: "8px 0px 0px 8px",
        height: "32px",
        fontSize: 12,
        textAlign: "right",
        bgcolor: "#f5f5f5",
        whiteSpace: "nowrap"
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                borderRadius: 2,
                height: "79vh",
                display: "flex",
                flexDirection: "row",
                gap: 1,
                backgroundColor: "#f8fafc",
                overflow: "hidden",
            }}
        >

            {/* LEFT - Orders */}
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

                {/* Orders list container */}
                <Box
                    sx={{
                        flex: 1,
                        minHeight: 0,        // 🔥 must
                        overflow: "hidden",  // όχι auto εδώ
                    }}
                >
                    <OrdersView
                        columnVisibility={columnVisibility}
                        setColumnVisibility={setColumnVisibility}
                        importedPageSize={5}
                        selectionModel={selectionModel}
                        setSelectionModel={setSelectionModel}
                        setOrdersRow={setOrdersRow}
                        selection={true}
                        height={"58vh"}
                        width={200}
                    />
                </Box>

                <Button
                    onClick={handleClickAddtoRoute}
                    variant="contained"
                    size="small"
                    sx={{
                        mt: 1,
                        textTransform: "none",
                        borderRadius: 1,
                    }}
                >
                    Add to Route
                </Button>
            </Box>

            {/* RIGHT - Route */}
            <Box
                sx={{
                    width: "34%",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Create Route
                </Typography>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack
                        direction="row"
                        alignItems="stretch"
                        spacing={0}
                    >
                            <Box sx={labelSx}>
                                Route name<span style={{ color: "#d32f2f", marginLeft: 4 }}>*</span>
                            </Box>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Enter route name..."
                                // value={address}
                                // onChange={(e) => setAddress(e.target.value)}
                                // error={Boolean(orderErrors?.address)}
                                // helperText={orderErrors?.address ?? " "}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        fontSize: 12,
                                        height: 32,
                                        borderRadius: "0 8px 8px 0", // ✅ εδώ σωστά

                                        "& fieldset": {
                                            borderColor: "#e0e0e0",
                                        },

                                        "&:hover fieldset": {
                                            borderColor: "#bdbdbd",
                                        },

                                        "&.Mui-focused fieldset": {
                                            borderColor: "#1976d2",
                                        },
                                    },
                                }}
                            />
                        </Stack>
                    </Grid>

                <Divider sx={{ mb: 2 }} />

                {/* Stops */}
                <Box
                    sx={{
                        flex: 1,
                        width: "100%",
                        overflow: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}
                >
                    <DndContext onDragEnd={handleDragEnd}>
                        <SortableContext items={stops.map(s => s.id)}>

                            {stops.map((order, index) => (
                                <SortableStop
                                    key={order.id}
                                    order={order}
                                    index={index}
                                    onDelete={handleDeleteStop}
                                />
                            ))}

                        </SortableContext>
                    </DndContext>
                </Box>

                <Button
                    variant="contained"
                    color="success"
                    size="small"
                    sx={{
                        mt: 1,
                        textTransform: "none",
                        borderRadius: 1,
                    }}
                >
                    Save Route
                </Button>
            </Box>

        </Paper>
    );
}

export default CreateRoute;