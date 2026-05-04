import {z} from "zod";
import {orderSchema} from "./useOrderFormValidation.ts";
import type {Driver, OrderRow} from "../types/Types.ts";
import {useState} from "react";

const routeSchema = z.object({
        stops: z.array(orderSchema).min(1, "You must add at least 1 order to the route"),
        driver: z.object({
                id: z.number(),
                name: z.string()
            }, { error: "You must select a driver" }),
        routeName: z.string().min(3, "You must enter a route name with at least 3 characters")
}

);

export interface RouteInsertErrors {
    routeName?: string;
    driver?: string;
    stops?: string;
}

type UseRouteInsertValidationProps = {
    stops: OrderRow[];
    driver: Driver | null;
    routeName: string;
}

const useRouteInsertValidation = ({stops, driver, routeName}: UseRouteInsertValidationProps) => {

    const [routeErrors, setRouteErrors] = useState<RouteInsertErrors>({});

    const validateRouteInsert = (): boolean => {

        const result = routeSchema.safeParse({
            driver: driver,
            stops: stops,
            routeName: routeName
        });

        if (!result.success) {
            const newErrors: RouteInsertErrors = {};
            result.error.issues.forEach(error => {
                const fieldName = error.path[0] as keyof RouteInsertErrors;
                newErrors[fieldName] = error.message;
            });
            setRouteErrors(newErrors);
            return false;
        }

        setRouteErrors({})
        return true;
    }

    return {
        validateRouteInsert,
        routeErrors,
        setRouteErrors
    }

}

export default useRouteInsertValidation;