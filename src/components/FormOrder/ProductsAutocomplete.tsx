import { Autocomplete, Box, Divider, Stack, TextField, Typography } from "@mui/material";
import type {Product, SelectedProduct} from "../../types/Types.ts";
import { useEffect, useMemo, useState } from "react";
import { searchProducts } from "../../services/productService.ts";

interface ProductsAutocompleteProps {
    selectedProductsWithQty: SelectedProduct[];
    setSelectedProductsWithQty: React.Dispatch<React.SetStateAction<SelectedProduct[]>>;
}

interface Option {
    value: number;
    label: string;
}

const ProductsAutocomplete = ({
                                  selectedProductsWithQty,
                                  setSelectedProductsWithQty,
                              }: ProductsAutocompleteProps) => {

    const [totalAmount, setTotalAmount] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    // -----------------------------
    // OPTIONS (memoized = faster + cleaner)
    // -----------------------------
    const productOptions: Option[] = useMemo(() => {
        return (options ?? [])
            .filter((p) => p.quantity > 0)
            .map((p) => ({
                value: p.id,
                label: p.name
            }));
    }, [options]);

    const availableOptions = useMemo(() => {
        return productOptions.filter(
            (p) => !selectedProductsWithQty.some(sel => sel.product.id === p.value)
        );
    }, [productOptions, selectedProductsWithQty]);

    const selectedOptions = useMemo(() => {
        return selectedProductsWithQty.map((p) => ({
            value: p.product.id,
            label: p.product.name
        }));
    }, [selectedProductsWithQty]);

    // -----------------------------
    // HANDLERS
    // -----------------------------
    const handleQuantityChange = (index: number, value: string) => {
        setSelectedProductsWithQty(prev => {
            const copy = [...prev];

            copy[index] = {
                ...copy[index],
                quantity: value === "" ? "" : Number(value)
            } as any;

            return copy;
        });
    };

    const handlePriceChange = (index: number, value: string) => {
        setSelectedProductsWithQty(prev => {
            const copy = [...prev];

            copy[index] = {
                ...copy[index],
                price: value === "" ? "" : Number(value)
            } as any;

            return copy;
        });
    };

    const handleChange = (_: React.SyntheticEvent, selected: Option[]) => {
        const arr = Array.isArray(selected) ? selected : [];

        setSelectedProductsWithQty(
            arr.map((s) => {
                const existing = selectedProductsWithQty.find(
                    (p) => p.product.id === s.value
                );

                const product = options.find((p) => p.id === s.value);

                return (
                    existing ?? {
                        product: product!,
                        quantity: 1,
                        price: product!.price
                    }
                );
            })
        );
    };

    // -----------------------------
    // TOTAL CALCULATION
    // -----------------------------
    useEffect(() => {
        const total = selectedProductsWithQty.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        setTotalAmount(Number(total.toFixed(2)));
    }, [selectedProductsWithQty]);

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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>

            {/* Autocomplete */}
            <Autocomplete<Option, true>
                multiple
                fullWidth
                options={availableOptions}
                value={selectedOptions}
                getOptionLabel={(o) => o.label}
                loading={loading}
                inputValue={inputValue}
                onInputChange={(_, value) => setInputValue(value)}
                onChange={handleChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Products"
                        placeholder="Search products..."
                        sx={{
                            backgroundColor: "white",
                            borderRadius: 2
                        }}
                    />
                )}
            />

            {/* Selected Products */}
            {selectedProductsWithQty.map((item, index) => (
                <Stack
                    key={item.product.id}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                >
                    <Typography sx={{ width: 140 }}>
                        {item.product.name}
                    </Typography>

                    <TextField
                        size="medium"
                        type="number"
                        label="Qty"
                        value={item.quantity}
                        onChange={(e) =>
                            handleQuantityChange(index, e.target.value)
                        }
                        inputProps={{ min: 1 }}
                        sx={{ width: 90, backgroundColor: "white" }}
                    />

                    <TextField
                        size="medium"
                        type="number"
                        label="Price"
                        value={item.price}
                        onChange={(e) =>
                            handlePriceChange(index, e.target.value)
                        }
                        inputProps={{ min: 0, step: "0.01"}}
                        sx={{ width: 120, backgroundColor: "white" }}
                    />
                </Stack>
            ))}

            {/* Total */}
            {selectedProductsWithQty.length > 0 && (
                <>
                    <Divider sx={{ width: "100%" }} />
                    <Typography sx={{ textAlign: "right", fontWeight: 600 }}>
                        Total: {totalAmount} €
                    </Typography>
                </>
            )}
        </Box>
    );
};

export default ProductsAutocomplete;