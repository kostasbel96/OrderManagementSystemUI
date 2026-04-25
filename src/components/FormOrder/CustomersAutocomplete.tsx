import {Autocomplete, TextField} from "@mui/material";
import type {Customer} from "../../types/Types.ts";
import {useEffect, useState} from "react";
import { searchCustomers } from "../../services/customerService.ts";

interface CustomersAutocompleteProps {
    selectedCustomer: Customer | null;
    setSelectedCustomer: React.Dispatch<React.SetStateAction<Customer | null>>,
    errorMessage?: string;
}

const CustomersAutocomplete = ({selectedCustomer, setSelectedCustomer, errorMessage}: CustomersAutocompleteProps) => {

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
            popupIcon={null}
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
                    placeholder="Search customer..."
                    variant="outlined"
                    size="small"
                    error={Boolean(errorMessage)}
                    helperText={errorMessage ?? " "}
                    sx={{
                        backgroundColor: "#fafafa",

                        "& .MuiOutlinedInput-root": {
                            fontSize: 12,
                            height: 32,
                            paddingRight: "6px",

                            borderRadius: "0 8px 8px 0", // ✅ εδώ

                            "& fieldset": {
                                border: "1px solid #e0e0e0",
                            },

                            "&:hover fieldset": {
                                borderColor: "#bdbdbd",
                            },

                            "&.Mui-focused fieldset": {
                                borderColor: "#1976d2",
                            }
                        },

                        "& input": {
                            fontSize: 12,
                        },
                    }}
                />
            )}
        />
    )
}

export default CustomersAutocomplete;