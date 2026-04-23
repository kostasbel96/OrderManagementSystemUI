import { Autocomplete, Box, TextField } from "@mui/material";
import type {Product} from "../../types/Types.ts";
import { useEffect, useState } from "react";
import { searchProducts } from "../../services/productService.ts";

interface ProductsAutocompleteProps {
    selectedProduct: Product | null;
    setSelectedProduct: (product: Product | null) => void;
}

const ProductsAutocomplete = ({selectedProduct, setSelectedProduct}: ProductsAutocompleteProps) => {

    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    // -----------------------------
    // fetch
    // -----------------------------
    useEffect(() => {
        if (!inputValue.trim()) {
            setOptions([]);
            return;
        }

        const timeout = setTimeout(() => {
            setLoading(true);

            searchProducts({
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

    // -----------------------------
    // UI
    // -----------------------------
    return (
        <Box>

            {/* Autocomplete */}
            <Autocomplete<Product>
                fullWidth
                options={options}
                value={selectedProduct}
                getOptionLabel={(o) => o.name}
                loading={loading}
                inputValue={inputValue}
                onInputChange={(_, value) => setInputValue(value)}
                onChange={(_, value) => setSelectedProduct(value)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Product"
                        placeholder="Search products..."
                        size="small"
                        sx={{
                            backgroundColor: "white",
                            borderRadius: 2,
                            "& .MuiInputBase-root": {
                                fontSize: 12
                            },
                            "& input": {
                                padding: "4px 6px",
                                fontSize: 12,
                            },
                        }}
                    />
                )}
            />
        </Box>
    );
};

export default ProductsAutocomplete;