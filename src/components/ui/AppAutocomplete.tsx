import { Autocomplete, TextField } from "@mui/material";

type Props<T> = {
    options: T[];
    value: T | null;
    inputValue: string;
    loading?: boolean;
    error?: boolean;
    helperText?: string;

    getOptionLabel: (option: T) => string;

    onChange: (value: T | null) => void;
    onInputChange: (value: string) => void;

    placeholder?: string;
};

export function AppAutocomplete<T>({
                                       options,
                                       value,
                                       inputValue,
                                       loading,
                                       error,
                                       helperText,
                                       getOptionLabel,
                                       onChange,
                                       onInputChange,
                                       placeholder,
                                   }: Readonly<Props<T>>) {
    return (
        <Autocomplete<T>
            popupIcon={null}
            fullWidth
            options={options}
            value={value}
            inputValue={inputValue}
            loading={loading}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={(o: any, v: any) => o.id === v?.id}
            onChange={(_, v) => onChange(v)}
            onInputChange={(_, v) => onInputChange(v)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={placeholder}
                    size="small"
                    error={Boolean(error)}
                    helperText={helperText ?? " "}
                    sx={{
                        backgroundColor: "#fafafa",
                        "& .MuiFormHelperText-root": { color: "#d32f2f" },
                        "& .MuiOutlinedInput-root": {
                            fontSize: 12,
                            height: 32,
                            borderRadius: "0 8px 8px 0",
                            borderColor: "red",
                            "& fieldset": { border: "1px solid #e0e0e0" },
                            "&:hover fieldset": { borderColor: "#bdbdbd" },
                            "&.Mui-focused fieldset": { borderColor: "#1976d2" },
                        },
                        "& input": { fontSize: 12 },
                    }}
                />
            )}
        />
    );
}