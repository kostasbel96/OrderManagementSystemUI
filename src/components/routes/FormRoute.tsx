import {Paper} from "@mui/material";
import {useCallback, useEffect, useMemo, useState} from "react";
import type {OrderRow, RouteDetails} from "../../types/Types.ts";
import {arrayMove} from "@dnd-kit/sortable";
import type {GridRowSelectionModel} from "@mui/x-data-grid";
import RouteOrders from "./RouteOrders.tsx";
import RoutePanel from "./RoutePanel.tsx";
import useRouteInsertValidation from "../../hooks/useRouteInsertValidation.ts";
import {addRoute} from "../../services/routeService.ts";

interface FormRouteProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    setPopUpMessage: React.Dispatch<React.SetStateAction<string>>;
}

const FormRoute = ({setPopUpMessage, setSuccess, setSubmitted}: FormRouteProps) => {
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        actions: false,
    });

    const [routeDetails, setRouteDetails] = useState<RouteDetails>({
        name: localStorage.getItem("routeName") ? JSON.parse(localStorage.getItem("routeName") as string) : "",
        notes: "",
        driver: localStorage.getItem("driver") ? JSON.parse(localStorage.getItem("driver") as string) : null,
        stops: localStorage.getItem("stops") ? JSON.parse(localStorage.getItem("stops") as string) : []
    });
    const [ordersRow, setOrdersRow] = useState<OrderRow[]>([]);

    const updateStops = (stops: OrderRow[]) => {
        setRouteDetails((prev) => ({
            ...prev,
            stops: stops,
        }));
    }

    const {
        validateRouteInsert,
        routeErrors,
        setRouteErrors
    } = useRouteInsertValidation({
        stops: routeDetails.stops,
        driver: routeDetails.driver,
        routeName: routeDetails.name
    });

    const [selectionModel, setSelectionModel] =
        useState<GridRowSelectionModel>({
            type: "include",
            ids: new Set(),
        });

    const stopIds = useMemo(() => routeDetails.stops.map(s => s.id), [routeDetails.stops]);

    const handleDragEnd = useCallback((event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = routeDetails.stops.findIndex(s => s.id === active.id);
        const newIndex = routeDetails.stops.findIndex(s => s.id === over.id);
        updateStops(arrayMove(routeDetails.stops, oldIndex, newIndex));
    }, [routeDetails.stops]);

    const handleDeleteStop = useCallback((id: number) => {
        const newStops = routeDetails.stops.filter(s => Number(s.id) !== Number(id))
        updateStops(newStops);
        localStorage.setItem("stops", JSON.stringify(newStops));
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
        localStorage.setItem("driver", JSON.stringify(routeDetails.driver));
        localStorage.setItem("routeName", JSON.stringify(routeDetails.name));
        localStorage.setItem("stops", JSON.stringify(newStops));
    }, [routeDetails.stops, ordersRow, selectionModel]);

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
        updateStops([]);
    }, [validateRouteInsert]);

    const handleSaveRoute = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (validateRouteInsert()) {
            addRoute({name: routeDetails.name, notes: routeDetails.notes, driverId: routeDetails.driver?.id, orders: routeDetails.stops})
                .then(data=> {
                    setSubmitted(true);
                    setSuccess(true);
                    setRouteErrors({});
                    setPopUpMessage("Route created successfully");
                    console.log(data);
                }).catch(error => {
                    setSubmitted(true);
                    setSuccess(false);
                    setPopUpMessage(error.message);
            })
        }
    }, [validateRouteInsert]);

    useEffect(() => {
        setPopUpMessage("");
    }, []);

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
                routeDetails={routeDetails}
                routeErrors={routeErrors}
                setRouteDetails={setRouteDetails}
                stopIds={stopIds}
                onDragEnd={handleDragEnd}
                onDeleteStop={handleDeleteStop}
                onClearStops={handleClearStops}
                onSaveRoute={handleSaveRoute}
            />

        </Paper>
    );
}

export default FormRoute;