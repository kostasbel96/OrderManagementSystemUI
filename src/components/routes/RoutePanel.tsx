import {Box, Button, Chip, Divider, Grid, Stack, Typography} from "@mui/material";
import LabeledField from "../ui/LabeledField";
import {AppAutocomplete} from "../ui/AppAutocomplete.tsx";
import type {Driver, RouteDetails} from "../../types/Types.ts";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { SortableStop } from "../ui/SortableStop.tsx";
import {memo, useState} from "react";
import OMSLabel from "../ui/OMSLabel.tsx";
import {useDriverSearch} from "../../hooks/useDriverSearch.ts";
import type {RouteInsertErrors} from "../../hooks/useRouteInsertValidation.ts";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type {Dayjs} from "dayjs";


interface RoutePanelProps {
    routeDetails: RouteDetails;
    setRouteDetails: React.Dispatch<React.SetStateAction<RouteDetails>>;
    stopIds: (string | number)[];
    onDragEnd: (event: any) => void;
    onDeleteStop: (id: number) => void;
    onClearStops: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onSaveRoute: (e: React.MouseEvent<HTMLButtonElement>) => void;
    routeErrors: RouteInsertErrors;
}

const RoutePanel = memo(({
                        stopIds,
                        onDragEnd,
                        onDeleteStop,
                        onClearStops,
                        onSaveRoute,
                        routeErrors,
                        routeDetails,
                        setRouteDetails
                    }: RoutePanelProps) => {

    const [inputValue, setInputValue] = useState("");
    const { drivers, loading } = useDriverSearch(inputValue);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, element: keyof RouteDetails) => {
        e.preventDefault();
        setRouteDetails((prev) => ({
            ...prev,
            [element]: e.target.value,
        }));
    }

    const handleDateChange = (
        value: Dayjs | null,
        element: keyof RouteDetails
    ) => {
        setRouteDetails((prev) => ({
            ...prev,
            [element]: value,
        }));
    };

    const handleDriverChange = (driver: Driver | null) => {
        setRouteDetails(prev => ({ ...prev, driver }));
    }

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
                <Grid container spacing={0} sx={{ width: "100%" }}>

                    {/* ROUTE NAME */}
                    <Grid size={{xs: 12}} >
                        <LabeledField
                            label="Route name"
                            required
                            placeholder={"Enter route name..."}
                            value={routeDetails.name}
                            name={"routeName"}
                            onChange={(e) => handleChange(e, "name")}
                            error={Boolean(routeErrors?.routeName)}
                            helperText={routeErrors?.routeName}
                        />
                        <LabeledField
                            label="Notes"
                            placeholder={"Enter notes..."}
                            value={routeDetails.notes}
                            name={"notes"}
                            onChange={(e) => handleChange(e, "notes")}
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
                                    value={routeDetails.driver}
                                    inputValue={inputValue}
                                    loading={loading}
                                    placeholder="Search driver..."
                                    getOptionLabel={(c) => `${c.name} ${c.lastName}`}
                                    onChange={handleDriverChange}
                                    onInputChange={setInputValue}
                                    error={Boolean(routeErrors?.driver)}
                                    helperText={routeErrors?.driver}
                                />
                            </Box>
                        </Stack>
                    </Grid>

                    {/* DATE */}
                    <Grid size={{xs: 12}}>
                        <Stack direction="row" alignItems="stretch" spacing={0}>
                            <Box sx={{ flex: 1 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        value={routeDetails.date}
                                        label={"Date"}
                                        onChange={(value) => handleDateChange(value, "date")}
                                        format="DD/MM/YYYY"
                                        slotProps={{
                                            textField: {
                                                size: "small",
                                                fullWidth: true
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
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

                            {routeDetails.stops.map((order, index) => (
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
                    <Chip label={`In route: ${routeDetails.stops?.length ?? 0}`} color="primary" size="small" />

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