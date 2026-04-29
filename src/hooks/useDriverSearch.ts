import { useSearch } from "./common/useSearch";
import type {Driver} from "../types/Types.ts";
import {searchDriversMOCK} from "../services/driverService";
import {useCallback} from "react";


export function useDriverSearch(query: string) {
    const fetchDrivers = useCallback((search: string) => {
        return searchDriversMOCK(search);
    }, []);
    const { data, loading } = useSearch<Driver>({
        query,
        fetcher: fetchDrivers,
    });

    return { drivers: data, loading };
}