import type {Supplier} from "../types/Types.ts";
import { useSearch } from "./common/useSearch.ts";
import {useCallback} from "react";
import {searchSuppliers} from "../services/supplierService.ts";

export function useSupplierSearch(query: string) {
    const fetchSuppliers = useCallback(async (search: string) => {
        const res = await searchSuppliers({
            page: 0,
            pageSize: 1000,
            globalSearch: search,
            sortBy: "name",
            sortDirection: "asc",
            filters: []
        });
        return res.content;
    },[]);

    const { data, loading } = useSearch<Supplier>({
        query,
        fetcher: fetchSuppliers
    });

    return { suppliers: data, loading };
}