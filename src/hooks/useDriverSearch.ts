import { useSearch } from "./common/useSearch";
import type {Driver} from "../types/Types.ts";
import {searchDriversMOCK} from "../services/driverService";


export function useDriverSearch(query: string) {
    const { data, loading } = useSearch<Driver>({
        query,
        fetcher: (search) =>
            searchDriversMOCK(search).then((res) => res),
    });

    return { drivers: data, loading };
}