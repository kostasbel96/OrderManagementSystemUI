import OrdersView from "../orders/OrdersView.tsx";
import {Box, Button, Chip, Divider, Grid, Paper, Stack, Typography} from "@mui/material";
import {useCallback, useMemo, useState} from "react";
import type {Driver, OrderRow} from "../../types/Types.ts";
import {arrayMove, SortableContext} from "@dnd-kit/sortable";
import {DndContext} from "@dnd-kit/core";
import {SortableStop} from "../ui/SortableStop.tsx";
import type {GridRowSelectionModel} from "@mui/x-data-grid";
import {AppAutocomplete} from "../ui/AppAutocomplete.tsx";
import {useDriverSearch} from "../../hooks/useDriverSearch.ts";
import OMSLabel from "../ui/OMSLabel.tsx";
import LabeledField from "../ui/LabeledField.tsx";

const CreateRoute = () => {
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        actions: false,
    });

    const [inputValue, setInputValue] = useState("");
    const { drivers, loading } = useDriverSearch(inputValue);
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(() => {
        const saved = localStorage.getItem("routeDraft");
        return saved ? JSON.parse(saved).selectedDriver : null;
    })

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
    const stopIds = useMemo(() => stops.map(s => s.id), [stops]);

    const [routeName, setRouteName] = useState<string>("")

    const handleDragEnd = useCallback((event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = stops.findIndex(s => s.id === active.id);
        const newIndex = stops.findIndex(s => s.id === over.id);
        setStops(prev => arrayMove(prev, oldIndex, newIndex));
    }, [stops]);

    const handleDeleteStop = useCallback((id: number) => {
        const newStops = stops.filter(s => Number(s.id) !== Number(id))
        setStops(newStops);
        localStorage.setItem("stops", JSON.stringify(newStops));
    }, [stops]);

    const handleClickAddtoRoute = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const ids = selectionModel?.ids;

        if (!ids || !ordersRow?.length) return;

        const idArray = Array.from(ids);

        const stopIds = new Set(stops.map(s => Number(s.id)));

        const newStops = [...stops];

        for (const id of idArray) {
            const order = ordersRow.find(o => Number(o.id) === Number(id));

            if (order && !stopIds.has(Number(order.id))) {
                newStops.push(order);
                stopIds.add(Number(order.id));
            }
        }

        setStops(newStops);
        localStorage.setItem("stops", JSON.stringify(newStops));
    }, [stops, ordersRow, selectionModel]);

    const handleClickClearSelection = (e: React.MouseEvent<HTMLButtonElement>) =>{
        e.preventDefault();
        setSelectionModel({
            type: "include",
            ids: new Set(),
        });
    }

    const handleClickClearStops = (e: React.MouseEvent<HTMLButtonElement>) =>{
        e.preventDefault();
        localStorage.removeItem("stops");
        setStops([]);
    }

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
                        onClick={handleClickAddtoRoute}
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
                        onClick={handleClickClearSelection}
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
                <Grid container spacing={1.5} sx={{ width: "100%" }}>

                    {/* ROUTE NAME */}
                    <Grid size={{xs: 12}} >
                        <LabeledField
                            label="Route name"
                            required
                            placeholder={"Enter route name..."}
                            value={routeName}
                            name={"routeName"}
                            onChange={(e) => setRouteName(e.target.value)}
                            // error={Boolean(routeNameError)}
                            // helperText={routeNameError}
                        />
                    </Grid>

                    {/* DRIVER */}
                    <Grid size={{xs: 12}}>
                        <Stack direction="row" alignItems="stretch" spacing={0}>
                            <OMSLabel
                                required
                                label="Driver"
                            />
                            <Box sx={{ flex: 1 }}>
                                <AppAutocomplete<Driver>
                                    options={drivers}
                                    value={selectedDriver}
                                    inputValue={inputValue}
                                    loading={loading}
                                    placeholder="Search driver..."
                                    getOptionLabel={(c) => `${c.name} ${c.lastName}`}
                                    onChange={setSelectedDriver}
                                    onInputChange={setInputValue}
                                />
                            </Box>
                        </Stack>
                    </Grid>

                </Grid>

                <Divider sx={{ mb: 2, mt: 2 }} />

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
                        <SortableContext items={stopIds}>

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

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mt: 2,
                        width: "100%"
                    }}
                >
                    <Chip label={`In route: ${stops?.length ?? 0}`} color="primary" size="small" />

                    <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ borderColor: "#e0e0e0" }}
                    />

                    <Button
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{
                            textTransform: "none",
                            borderRadius: 1,
                        }}
                    >
                        Save Route
                    </Button>

                    <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ borderColor: "#e0e0e0" }}
                    />

                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={handleClickClearStops}
                        sx={{
                            textTransform: "none",
                            borderRadius: 1,
                        }}
                    >
                        Clear stops
                    </Button>
                </Box>
            </Box>

        </Paper>
    );
}

export default CreateRoute;