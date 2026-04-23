import {Autocomplete, TextField} from "@mui/material";
import type {Customer} from "../../types/Types.ts";
import {useEffect, useState} from "react";
import { searchCustomers } from "../../services/customerService.ts";

interface CustomersAutocompleteProps {
    selectedCustomer: Customer | null;
    setSelectedCustomer: React.Dispatch<React.SetStateAction<Customer | null>>,
}

const CustomersAutocomplete = ({selectedCustomer, setSelectedCustomer}: CustomersAutocompleteProps) => {

    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!inputValue.trim()) {
            setOptions([]);
            return;
        }

        const timeout = setTimeout(() => {
            setLoading(true);

            searchCustomers({
                page: 0,
                pageSize: 1000,
                globalSearch: inputValue,
                sortBy: "name",
                sortDirection: "asc",
                filters: []
            })
                .then((data) => {
                    setOptions(data.content);
                })
                .catch(console.error)
                .finally(() => setLoading(false));

        }, 300);

        return () => clearTimeout(timeout);
    }, [inputValue]);

    return (
            <Autocomplete<Customer>
                fullWidth
                options={options}
                getOptionLabel={(c) => `${c.name} ${c.lastName}`}
                value={selectedCustomer}
                loading={loading}
                inputValue={inputValue}
                onInputChange={(_, value) => setInputValue(value)}
                onChange={(_, value) => setSelectedCustomer(value)}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={"Customer"}
                        placeholder={`Search Customers...`}
                        sx={{
                            backgroundColor: "white",
                            borderRadius: 2,
                            '& .MuiInputLabel-root': {
                                backgroundColor: 'white',
                                borderRadius: 2,
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: 'gray',
                                backgroundColor: 'white',
                                borderRadius: 2,
                            }
                        }}
                    />
                )}
            />
    )
}

export default CustomersAutocomplete;