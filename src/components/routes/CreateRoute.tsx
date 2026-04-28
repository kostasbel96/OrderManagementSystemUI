import {Paper} from "@mui/material";
import {useCallback, useMemo, useState} from "react";
import type {Driver, OrderRow} from "../../types/Types.ts";
import {arrayMove} from "@dnd-kit/sortable";
import type {GridRowSelectionModel} from "@mui/x-data-grid";
import RouteOrders from "./RouteOrders.tsx";
import RoutePanel from "./RoutePanel.tsx";
import useRouteInsertValidation from "../../hooks/useRouteInsertValidation.ts";

const CreateRoute = () => {
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        actions: false,
    });

    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(() => {
        const saved = localStorage.getItem("routeDraft");
        return saved ? JSON.parse(saved).selectedDriver : null;
    });
    const [routeName, setRouteName] = useState<string>("");
    const [ordersRow, setOrdersRow] = useState<OrderRow[]>([]);
    const [stops, setStops] = useState<OrderRow[]>(() => {
        try {
            const data = localStorage.getItem("stops");
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    });

    const {
        validateRouteInsert,
        routeErrors,
        setRouteErrors
    } = useRouteInsertValidation({
        stops: stops,
        driver: selectedDriver,
        routeName: routeName
    });

    const [selectionModel, setSelectionModel] =
        useState<GridRowSelectionModel>({
            type: "include",
            ids: new Set(),
        });

    const stopIds = useMemo(() => stops.map(s => s.id), [stops]);

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

    const handleAddToRoute = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
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
        setRouteErrors({...routeErrors, stops: ""})
        localStorage.setItem("stops", JSON.stringify(newStops));
    }, [stops, ordersRow, selectionModel]);

    const handleClearSelection = useCallback((e: React.MouseEvent<HTMLButtonElement>) =>{
        e.preventDefault();
        setSelectionModel({
            type: "include",
            ids: new Set(),
        });
    }, []);

    const handleClearStops = useCallback((e: React.MouseEvent<HTMLButtonElement>) =>{
        e.preventDefault();
        localStorage.removeItem("stops");
        setStops([]);
        setRouteErrors({...routeErrors, stops: ""});
    }, [validateRouteInsert]);

    const handleSaveRoute = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (validateRouteInsert()) {
            console.log("ok");
            setRouteErrors({});
        }
    }, [validateRouteInsert]);

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
            {/* LEFT SIDE - ORDERS */}
            <RouteOrders
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
                setOrdersRow={setOrdersRow}
                onAddToRoute={handleAddToRoute}
                onClearSelection={handleClearSelection}
            />

            {/* RIGHT SIDE - ROUTES */}
            <RoutePanel
                routeErrors={routeErrors}
                routeName={routeName}
                setRouteName={setRouteName}
                selectedDriver={selectedDriver}
                setSelectedDriver={setSelectedDriver}
                stops={stops}
                stopIds={stopIds}
                onDragEnd={handleDragEnd}
                onDeleteStop={handleDeleteStop}
                onClearStops={handleClearStops}
                onSaveRoute={handleSaveRoute}
            />

        </Paper>
    );
}

export default CreateRoute;