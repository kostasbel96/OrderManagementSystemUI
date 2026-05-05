import {DndContext} from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";
import {SortableStop} from "../ui/SortableStop.tsx";
import {Box, Typography} from "@mui/material";
import type {RouteDetails} from "../../types/Types.ts";
import type {RouteInsertErrors} from "../../hooks/useRouteInsertValidation.ts";

interface RouteStopsProps {
    routeDetails: RouteDetails;
    stopIds: (string | number)[];
    onDragEnd: (event: any) => void;
    onDeleteStop: (id: number) => void;
    routeErrors: RouteInsertErrors;
}

const RouteStops = ({onDragEnd, stopIds, routeDetails, onDeleteStop, routeErrors}: RouteStopsProps) => {

    return (
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
            <Box sx={{ minHeight: 18 }}>
                {routeErrors?.stops && (
                    <Typography color="error" fontSize={11}>
                        {routeErrors?.stops}
                    </Typography>
                )}
            </Box>
        </Box>
    )

}

export default RouteStops;