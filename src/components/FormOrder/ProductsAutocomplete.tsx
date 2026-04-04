import {Autocomplete, Box, Stack, TextField} from "@mui/material"
import type {Product, SelectedProduct} from "../../types/Types.ts";
import {useEffect, useState} from "react";

interface ProductsAutocompleteProps {
    selectedProductsWithQty: SelectedProduct[];
    setSelectedProductsWithQty: React.Dispatch<React.SetStateAction<SelectedProduct[]>>
    products: Product[];
}

interface Option {
    value: number;
    label: string;
}

const ProductsAutocomplete = ({
                                  selectedProductsWithQty,
                                  setSelectedProductsWithQty,
                                  products} : ProductsAutocompleteProps) => {

    const [productOptions, setProductOptions] = useState<Option[]>([]);
    const [quantityValue, setQuantityValue] = useState<{id: number, quantity: string}>();
    const [priceValue, setPriceValue] = useState<{id: number, price: string}>();

    const handleQuantityChange = (index: number, quantity: number, id: number) => {
        setQuantityValue({id:id, quantity: quantity.toString()});
        if (!setSelectedProductsWithQty) return;
        const safeQuantity = Math.max(1, quantity);
        setSelectedProductsWithQty((prev: SelectedProduct[]) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], quantity: safeQuantity };
            return copy;
        });

    };


    const handlePriceChange = (
                                e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
                                index: number,
                                id: number) => {
        const price = e.target.value
        setPriceValue({id:id, price: price.toString()});
        if (!setSelectedProductsWithQty) return;
        const safePrice = Math.max(0, Number(price));
        setSelectedProductsWithQty((prev: SelectedProduct[]) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], price: safePrice};
            return copy;
        })
    };

    const handleChange = (
        _: React.SyntheticEvent,
        selected: Option[]
    ) => {
            const selectedArray = Array.isArray(selected) ? selected : [];
            setSelectedProductsWithQty?.(
                selectedArray.map((s) => {
                    const existing = selectedProductsWithQty?.find(
                        (p) => p.product.id === s.value
                    );
                    const product = products?.find((p) => p.id === s.value);
                    return existing || { product: product!, quantity: 1, price: product!.price };
                })
            );
    };

    const getOptions = (): Option[] => {
            return (productOptions || []).filter(
                (p) =>
                    !selectedProductsWithQty?.some(
                        (sel) => sel.product.id === p.value
                    )
            );

    };

    const getSelectedValue = (): Option[] => {
        return (selectedProductsWithQty ?? []).map((p) => ({
            value: p.product.id,
            label: p.product.name,
        }));
    };


    useEffect(() => {
        if (products){
            const productsWithValidQuantity = products.filter((p: Product)=> p.quantity > 0);
            const finalOptions = productsWithValidQuantity.map((p: Product) => ({
                value: p.id,
                label: p.name,
            }))
            setProductOptions(finalOptions);
        }
    },[products])



    return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, width: "100%"}}>
                {/* Autocomplete Select */}
                <Autocomplete<Option, true>
                    fullWidth
                    multiple
                    options={getOptions()}
                    getOptionLabel={(option: Option) => option.label}
                    value={getSelectedValue()}
                    onChange={handleChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={"Products"}
                            placeholder={`Search Products...`}
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

                {/* Quantity inputs for Products */}
                {selectedProductsWithQty &&
                    selectedProductsWithQty.map((item, index) => (
                        <Stack direction="row" spacing={1} alignItems="end" key={item.product.id}>
                            <Box sx={{ width: 120, textAlign: "center" }}>{item.product.name}:</Box>
                            <TextField
                                type="number"
                                label={"Quantity"}
                                value={quantityValue?.id === item.product.id ? quantityValue.quantity : item.quantity}
                                onChange={(e) => handleQuantityChange(index, Number(e.target.value), item.product.id)}
                                inputProps={{ min: 1 }}
                                sx={{
                                    width: 100,
                                    backgroundColor: "white",
                                    borderRadius: 2,
                                    '.MuiInputLabel-root':{
                                        backgroundColor: 'white',
                                        padding: '0.25rem',
                                        borderRadius: 2
                                    }
                                }}
                            />
                            <TextField
                                type="number"
                                label={"Price"}
                                value={priceValue?.id === item.product.id ? priceValue.price : item.price}
                                onChange={(e) => handlePriceChange(e, index, item.product.id)}
                                inputProps={{ min: 0 }}
                                sx={{
                                    width: 100,
                                    backgroundColor: "white",
                                    borderRadius: 2,
                                    '.MuiInputLabel-root':{
                                        backgroundColor: 'white',
                                        padding: '0.25rem',
                                        borderRadius: 2
                                    }
                                }}
                            />
                        </Stack>
                    ))}
            </Box>
    )
}

export default ProductsAutocomplete;
