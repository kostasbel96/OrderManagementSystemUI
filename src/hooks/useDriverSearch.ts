import { useSearch } from "./common/useSearch";
import type {Driver, DriverResponseDto} from "../types/Types.ts";
import {searchDrivers} from "../services/driverService";
import {useCallback} from "react";


export function useDriverSearch(query: string) {
    const fetchDrivers = useCallback((search: string) => {
        return searchDrivers({
            page: 0,
            pageSize: 1000,
            globalSearch: search,
            sortBy: "name",
            sortDirection: "asc",
            filters: []
        }).then((res: DriverResponseDto) => res.content);
    },[]);
    const { data, loading } = useSearch<Driver>({
        query,
        fetcher: fetchDrivers,
    });

    return { drivers: data, loading };
}