import { Autocomplete, Box, TextField } from "@mui/material";
import type {Product, SelectedProduct} from "../../types/Types.ts";
import {useEffect, useState} from "react";
import { searchProducts } from "../../services/productService.ts";

interface ProductsAutocompleteProps {
    selectedProduct: Product | undefined;
    setSelectedProduct: (product: Product | null) => void;
    selectedProductsWithQty?: SelectedProduct[];
    inputRef?: (el: HTMLInputElement | null) => void;
}

const ProductsAutocomplete = ({selectedProduct, setSelectedProduct, selectedProductsWithQty, inputRef}: ProductsAutocompleteProps) => {

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
                    const selectedIds: number[] = [];

                    if (selectedProductsWithQty) {
                        selectedIds.push(
                            ...selectedProductsWithQty
                                .map(item => item.product?.id)
                                .filter((id): id is number => id !== undefined)
                        );
                    }

                    const opt = data.content.filter(
                        (p: Product) => p.id !== undefined && !selectedIds.includes(p.id)
                    );

                    setOptions(opt);
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
        <Box sx={{ width: "100%" }}>
            <Autocomplete<Product, false, true, false>
                fullWidth
                popupIcon={null}
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
                        inputRef={inputRef}
                        variant="outlined"
                        placeholder="Search Product..."
                        size="small"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                fontSize: 11,
                                height: 26,
                                paddingRight: "4px",

                                "& fieldset": {
                                    border: "none",
                                },
                                "&:hover fieldset": {
                                    border: "1px solid #ccc",
                                },
                                "&.Mui-focused fieldset": {
                                    border: "1px solid #1976d2",
                                },
                            },

                            "& input": {
                                padding: "2px 6px",
                            },
                        }}
                    />
                )}
            />
        </Box>
    );
};

export default ProductsAutocomplete;