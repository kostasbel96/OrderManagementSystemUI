import {getApiUrl} from "../helper/IpHelper.ts";
import type {Driver, DriverResponseDto, SearchRequest} from "../types/Types.ts";

const API_URL = getApiUrl();


const drivers: Driver[] = [
    { id: 1, name: "Γιώργος", lastName: "Παπαδόπουλος", phoneNumber1: "6900000001" },
    { id: 2, name: "Νίκος", lastName: "Κωνσταντίνου", phoneNumber1: "6900000002" },
    { id: 3, name: "Μιχάλης", lastName: "Ιωαννίδης", phoneNumber1: "6900000003" },
    { id: 4, name: "Κώστας", lastName: "Δημητρίου", phoneNumber1: "6900000004" },
    { id: 5, name: "Παναγιώτης", lastName: "Ανδρέου", phoneNumber1: "6900000005" },
    { id: 6, name: "Θανάσης", lastName: "Καραγιάννης", phoneNumber1: "6900000006" },
    { id: 7, name: "Δημήτρης", lastName: "Σταυρόπουλος", phoneNumber1: "6900000007" },
    { id: 8, name: "Αλέξανδρος", lastName: "Μακρής", phoneNumber1: "6900000008" },
    { id: 9, name: "Βασίλης", lastName: "Νικολάου", phoneNumber1: "6900000009" },
    { id: 10, name: "Χρήστος", lastName: "Παναγιωτίδης", phoneNumber1: "6900000010" },
];

export async function searchDriversMOCK(query: string) : Promise<Driver[]>{
    return drivers.filter(driver => driver.name.toLowerCase().includes(query.toLowerCase()));
}

export async function searchDrivers(request: SearchRequest): Promise<DriverResponseDto> {
    const res = await fetch(`${API_URL}/drivers/search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            page: request.page,
            pageSize: request.pageSize,
            globalSearch: request.globalSearch ?? "",
            filters: request.filters ?? [],
            sort: {
                field: request.sortBy ?? "name",
                sort: request.sortDirection ?? "asc"
            }
        })
    });

    if (!res.ok) throw new Error("Failed to search drivers");

    const data = await res.json();
    return {
        content: data.content,
        totalElements: data.totalElements,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize
    };
}
