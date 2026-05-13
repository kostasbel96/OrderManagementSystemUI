import * as React from "react";
import {
    FormControl,
    Select,
    MenuItem,
    type SxProps,
    type Theme,
} from "@mui/material";
import type {SetStateAction} from "react";

const fieldSx: SxProps<Theme> = {
    "& .MuiOutlinedInput-root": {
        fontSize: 12,
        height: 32,
        borderRadius: "0 8px 8px 0",
        alignItems: "center",
        backgroundColor: "#f5f5f5",

        "& fieldset": {
            borderColor: "#e0e0e0",
        },

        "&:hover fieldset": {
            borderColor: "#bdbdbd",
        },

        "&.Mui-focused fieldset": {
            borderColor: "#1976d2",
        },

        "& .MuiSelect-select": {
            padding: "0 8px",
            height: "100%",
            display: "flex",
            alignItems: "center",
        },
    },
};

interface OMSSelectProps {
    setSelectValue: React.Dispatch<SetStateAction<string>>;
    selectValue: string;
}

export default function OMSSelect({setSelectValue, selectValue}: Readonly<OMSSelectProps>) {

    return (
        <FormControl
            size="small"
            sx={{
                minWidth: 220,
                ...fieldSx,
            }}
        >
            <Select
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
            >
                <MenuItem value="orderCustomer">
                    Order to Customer
                </MenuItem>

                <MenuItem value="orderSupplier">
                    Order to Supplier
                </MenuItem>
            </Select>
        </FormControl>
    );
}