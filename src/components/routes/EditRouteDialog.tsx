import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper} from "@mui/material";
import RouteOrders from "./RouteOrders.tsx";
import {useCallback, useMemo, useState} from "react";
import type {GridRowSelectionModel} from "@mui/x-data-grid";
import type {OrderRow, Route, RouteDetails} from "../../types/Types.ts";
import useRouteInsertValidation from "../../hooks/useRouteInsertValidation.ts";
import RouteStops from "./RouteStops.tsx";
import {arrayMove} from "@dnd-kit/sortable";

interface EditRouteDialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    orders: OrderRow[],
    importedRouteDetails: RouteDetails;
    setRouteValues: React.Dispatch<React.SetStateAction<Route>>;
}

const EditRouteDialog = ({
                            open,
                            setOpen,
                            orders,
                            importedRouteDetails,
                            setRouteValues
                         }: EditRouteDialogProps) => {
    const [ordersRow, setOrdersRow] = useState<OrderRow[]>(orders);
    const [routeDetails, setRouteDetails] = useState(importedRouteDetails);
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        actions: false,
    });
    const [selectionModel, setSelectionModel] =
        useState<GridRowSelectionModel>({
            type: "include",
            ids: new Set(),
        });
    const {
        validateRouteInsert,
        routeErrors,
        setRouteErrors
    } = useRouteInsertValidation({
        stops: routeDetails.stops,
        driver: routeDetails.driver,
        routeName: routeDetails.name,
    });

    const stopIds = useMemo(() => routeDetails.stops.map(s => s.id), [routeDetails.stops]);


    const handleDragEnd = useCallback((event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = routeDetails.stops.findIndex(s => s.id === active.id);
        const newIndex = routeDetails.stops.findIndex(s => s.id === over.id);
        updateStops(arrayMove(routeDetails.stops, oldIndex, newIndex));
    }, [routeDetails.stops]);

    const handleAddToRoute = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const ids = selectionModel?.ids;

        if (!ids || !ordersRow?.length) return;

        const idArray = Array.from(ids);

        const stopIds = new Set(routeDetails.stops.map(s => Number(s.id)));

        const newStops = [...routeDetails.stops];

        for (const id of idArray) {
            const order = ordersRow.find(o => Number(o.id) === Number(id));

            if (order && !stopIds.has(Number(order.id))) {
                newStops.push(order);
                stopIds.add(Number(order.id));
            }
        }

        updateStops(newStops);
        setRouteErrors({...routeErrors, stops: ""})
    }, [routeDetails.stops, ordersRow, selectionModel]);

    const updateStops = (stops: OrderRow[]) => {
        setRouteDetails((prev) => ({
            ...prev,
            stops: stops,
        }));
    }

    const handleClearSelection = useCallback((e: React.MouseEvent<HTMLButtonElement>) =>{
        e.preventDefault();
        setSelectionModel({
            type: "include",
            ids: new Set(),
        });
    }, []);

    const handleSave = () => {
        if (validateRouteInsert()) {
            setRouteValues((prev) => ({
                ...prev,
                orders: routeDetails.stops.map(stop => ({
                    id: stop.id,
                    customer: stop.customer,
                    items: stop.products,      // OrderRow.products → OrderItem.items
                    address: stop.address,
                    status: stop.status,
                    total: String(stop.total), // number → string
                    date: stop.date as string,
                }))
            }));
            setOpen(false);
        }
    }


    const handleDeleteStop = useCallback((id: number) => {
        const newStops = routeDetails.stops.filter(s => Number(s.id) !== Number(id))
        updateStops(newStops);
        localStorage.setItem("stops", JSON.stringify(newStops));
    }, [routeDetails.stops]);


    return (
        <Dialog open={open} maxWidth="xl" fullWidth
                onKeyDown={(e) => {
                    if (e.key === "Enter" ){
                        e.preventDefault();
                    }
                }}
        >
            <DialogTitle>Edit Route</DialogTitle>
            <DialogContent>
                <Paper
                    elevation={3}
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        height: "75vh",
                        display: "flex",
                        flexDirection: "row",
                        gap: 1,
                        backgroundColor: "#f8fafc",
                        overflow: "hidden",
                    }}
                >
                    <RouteOrders
                        columnVisibility={columnVisibility}
                        setColumnVisibility={setColumnVisibility}
                        selectionModel={selectionModel}
                        setSelectionModel={setSelectionModel}
                        setOrdersRow={setOrdersRow}
                        onAddToRoute={handleAddToRoute}
                        onClearSelection={handleClearSelection}
                    />
                    <Box
                        sx={{
                            width: "34%",
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                            minHeight: 0,
                        }}
                    >
                        <RouteStops
                            routeErrors={routeErrors}
                            routeDetails={routeDetails}
                            stopIds={stopIds}
                            onDragEnd={handleDragEnd}
                            onDeleteStop={handleDeleteStop}
                        />
                    </Box>
                </Paper>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button variant="contained"
                        onClick={handleSave}
                        type="button"
                >Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditRouteDialog;