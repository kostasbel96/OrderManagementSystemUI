import {useState} from "react";
import {useTranslation} from "react-i18next";
import {orderSchema} from "./useCustomerOrderFormValidation.ts";
import type {Driver, OrderRow} from "../types/Types.ts";
import {z} from "zod";


const routeSchema = (t: any) => z.object({
    stops: z.array(orderSchema(t))
        .min(1, t("validation.minRouteStops")),

    driver: z.object({
        id: z.number(),
        name: z.string()
    }, {
        error: t("validation.driverRequired")
    }),

    routeName: z.string()
        .min(3, t("validation.routeNameMin"))
});

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

const useRouteInsertValidation = ({
                                      stops,
                                      driver,
                                      routeName
                                  }: UseRouteInsertValidationProps) => {

    const [routeErrors, setRouteErrors] = useState<RouteInsertErrors>({});
    const { t } = useTranslation();

    const validateRouteInsert = (): boolean => {

        const result = routeSchema(t).safeParse({
            driver,
            stops,
            routeName
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

        setRouteErrors({});
        return true;
    };

    return {
        validateRouteInsert,
        routeErrors,
        setRouteErrors
    };
};

export default useRouteInsertValidation;