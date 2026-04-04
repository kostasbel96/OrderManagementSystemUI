import {Autocomplete, TextField} from "@mui/material";
import type {Customer} from "../../types/Types.ts";

interface CustomersAutocompleteProps {
    customers: Customer[];
    selectedCustomer: Customer | null;
    setSelectedCustomer: React.Dispatch<React.SetStateAction<Customer | null>>,
}

const CustomersAutocomplete = ({customers, selectedCustomer, setSelectedCustomer}: CustomersAutocompleteProps) => {

    return (
            <Autocomplete<Customer>
                fullWidth
                options={customers}
                getOptionLabel={(c) => `${c.name} ${c.lastName} (#${c.id})`}
                value={selectedCustomer}
                onChange={(_, value) => setSelectedCustomer(value)}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={"Customer"}
                        placeholder={`Search Customers...`}
                        sx={{
                            width: "100%",
                            backgroundColor: "white",
                            borderRadius: 2,
                            '& .MuiInputLabel-root': {
                                backgroundColor: 'white',
                                borderRadius: 2,
                                padding: "2px"
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: 'gray',
                                backgroundColor: 'white',
                                borderRadius: 2,
                                padding: "2px",
                            }
                        }}
                    />
                )}
            />
    )
}

export default CustomersAutocomplete;