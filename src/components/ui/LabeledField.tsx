import { Stack, type SxProps, TextField, type TextFieldProps } from "@mui/material";
import { type Theme } from "@mui/material/styles";
import OMSLabel from "./OMSLabel.tsx";



const fieldSx: SxProps<Theme> = { // ✅ πρόσθεσε type
    "& .MuiOutlinedInput-root": {
        fontSize: 12,
        height: 32,
        borderRadius: "0 8px 8px 0", // ✅ εδώ σωστά
        alignItems: "center",

        "& fieldset": {
            borderColor: "#e0e0e0",
        },

        "&:hover fieldset": {
            borderColor: "#bdbdbd",
        },

        "&.Mui-focused fieldset": {
            borderColor: "#1976d2",
        },
        "& .MuiInputBase-input": {
            padding: "0 8px",
            height: "100%",
            display: "flex",
            alignItems: "center",
        },
    }
};

interface LabeledFieldProps {
    label: string;
    required?: boolean;
    value?: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string | boolean;
    helperText?: string;
    name?: string;
    placeholder?: string;
    sx?: SxProps<Theme>;
    labelSxOverride?: SxProps<Theme>;
    textFieldProps?: Omit<TextFieldProps, "value" | "onChange" | "error" | "helperText" | "placeholder" | "sx">;
}

export default function LabeledField({
                                         label,
                                         required = false,
                                         value,
                                         onChange,
                                         error,
                                         helperText,
                                         name,
                                         placeholder,
                                         sx,
                                         labelSxOverride,
                                         textFieldProps = {},
                                     }: Readonly<LabeledFieldProps>) {
    return (
        <Stack direction="row" alignItems="stretch" spacing={0}>
            <OMSLabel
                required={required}
                label={label}
                labelSxOverride={labelSxOverride}
            />
            <TextField
                name={name}
                fullWidth
                size="small"
                placeholder={placeholder ?? `Enter ${label?.toLowerCase()}...`}
                value={value}
                onChange={onChange}
                error={Boolean(error)}
                helperText={helperText ?? " "}
                sx={{ ...fieldSx as object, ...sx as object } as SxProps<Theme>}
                {...textFieldProps}
            />
        </Stack>
    );
}