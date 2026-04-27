import { searchCustomers } from "../services/customerService.ts";
import type { Customer, CustomerResponseDto } from "../types/Types.ts";
import { useSearch } from "./common/useSearch.ts";

export function useCustomerSearch(query: string) {
    const { data, loading } = useSearch<Customer>({
        query,
        fetcher: (search: string) =>
            searchCustomers({
                page: 0,
                pageSize: 1000,
                globalSearch: search,
                sortBy: "name",
                sortDirection: "asc",
                filters: [],
            }).then((res: CustomerResponseDto) => res.content),
    });

    return { customers: data, loading };
}