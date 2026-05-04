import {DndContext} from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";
import {SortableStop} from "../ui/SortableStop.tsx";
import {Box} from "@mui/material";
import type {RouteDetails} from "../../types/Types.ts";

interface RouteStopsProps {
    routeDetails: RouteDetails;
    stopIds: (string | number)[];
    onDragEnd: (event: any) => void;
    onDeleteStop: (id: number) => void;
}

const RouteStops = ({onDragEnd, stopIds, routeDetails, onDeleteStop}: RouteStopsProps) => {

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
        </Box>
    )

}

export default RouteStops;