import {Box, Button, Chip, Divider, Grid, Stack, Typography} from "@mui/material";
import LabeledField from "../ui/LabeledField";
import {AppAutocomplete} from "../ui/AppAutocomplete.tsx";
import type {Driver, OrderRow} from "../../types/Types.ts";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { SortableStop } from "../ui/SortableStop.tsx";
import {memo, useState} from "react";
import OMSLabel from "../ui/OMSLabel.tsx";
import {useDriverSearch} from "../../hooks/useDriverSearch.ts";
import type {RouteInsertErrors} from "../../hooks/useRouteInsertValidation.ts";


interface RoutePanelProps {
    routeName: string;
    setRouteName: React.Dispatch<React.SetStateAction<string>>;
    selectedDriver: Driver | null;
    setSelectedDriver: React.Dispatch<React.SetStateAction<Driver | null>>;
    stops: OrderRow[];
    stopIds: (string | number)[];
    onDragEnd: (event: any) => void;
    onDeleteStop: (id: number) => void;
    onClearStops: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onSaveRoute: (e: React.MouseEvent<HTMLButtonElement>) => void;
    routeErrors: RouteInsertErrors;
}

const RoutePanel = memo(({
                        routeName,
                        setRouteName,
                        selectedDriver,
                        setSelectedDriver,
                        stops,
                        stopIds,
                        onDragEnd,
                        onDeleteStop,
                        onClearStops,
                        onSaveRoute,
                        routeErrors
                    }: RoutePanelProps) => {

    const [inputValue, setInputValue] = useState("");
    const { drivers, loading } = useDriverSearch(inputValue);

    return (
            <Box
                sx={{
                    width: "34%",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",  // ← προσθέτεις αυτό
                    minHeight: 0,        // ← και αυτό
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
                            error={Boolean(routeErrors?.routeName)}
                            helperText={routeErrors?.routeName}
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
                                    error={Boolean(routeErrors?.driver)}
                                    helperText={routeErrors?.driver}
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
                        minHeight: 0,
                        overflow: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}
                >
                    <DndContext onDragEnd={onDragEnd} autoScroll={false} >
                        <SortableContext items={stopIds}>

                            {stops.map((order, index) => (
                                <SortableStop
                                    key={order.id}
                                    order={order}
                                    index={index}
                                    onDelete={onDeleteStop}
                                />
                            ))}

                        </SortableContext>
                    </DndContext>
                </Box>
                <Box sx={{ minHeight: 18 }}>
                    {routeErrors?.stops && (
                        <Typography color="error" fontSize={11}>
                            {routeErrors?.stops}
                        </Typography>
                    )}
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
                        onClick={onSaveRoute}
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
                        onClick={onClearStops}
                        sx={{
                            textTransform: "none",
                            borderRadius: 1,
                        }}
                    >
                        Clear stops
                    </Button>
                </Box>
            </Box>
    );

});

export default RoutePanel;