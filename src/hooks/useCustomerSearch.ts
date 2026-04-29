import { searchCustomers } from "../services/customerService.ts";
import type { Customer, CustomerResponseDto } from "../types/Types.ts";
import { useSearch } from "./common/useSearch.ts";
import {useCallback} from "react";

export function useCustomerSearch(query: string) {
    const fetchCustomers = useCallback((search: string) => {
        return searchCustomers({
            page: 0,
            pageSize: 1000,
            globalSearch: search,
            sortBy: "name",
            sortDirection: "asc",
            filters: []
        }).then((res: CustomerResponseDto) => res.content);
    },[]);

    const { data, loading } = useSearch<Customer>({
        query,
        fetcher: fetchCustomers
    });

    return { customers: data, loading };
}