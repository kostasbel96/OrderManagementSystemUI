import {Autocomplete, Box, Stack, TextField} from "@mui/material"
import type {Customer, Product} from "../../types/Types.ts";
import {useEffect, useState} from "react";

interface SelectProps {
    myValue: string;
    isMultiValue: boolean;
    customers?: Customer[];
    selectedProductsWithQty?: SelectedProduct[];
    selectedCustomer?: Customer | null;
    setSelectedProductsWithQty?: React.Dispatch<React.SetStateAction<SelectedProduct[]>>
    setSelectedCustomer?: React.Dispatch<React.SetStateAction<Customer | null>>,
    products?: Product[];
}
interface SelectedProduct {
    product: Product;
    quantity: number;
}

interface Option {
    value: number;
    label: string;
}

const MySelect = ({myValue,
                                                  isMultiValue,
                                                  customers,
                                                  selectedProductsWithQty,
                                                  selectedCustomer,
                                                  setSelectedProductsWithQty,
                                                  setSelectedCustomer,
                                                  products} : SelectProps) => {

    const [productOptions, setProductOptions] = useState<Option[]>([]);

    const customersOptions = customers?.map((p) => ({
        value: p.id!,
        label: `${p.name} ${p.lastName}`,
    }));

    const handleQuantityChange = (index: number, quantity: number) => {
        if (!setSelectedProductsWithQty) return;
        const safeQuantity = Math.max(1, quantity);
        setSelectedProductsWithQty((prev: SelectedProduct[]) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], quantity: safeQuantity };
            return copy;
        });

    };

    const handleChange = (
        _: React.SyntheticEvent,
        selected: Option | Option[] | null
    ) => {
        if (isMultiValue) {
            const selectedArray = Array.isArray(selected) ? selected : [];

            setSelectedProductsWithQty?.(
                selectedArray.map((s) => {
                    const existing = selectedProductsWithQty?.find(
                        (p) => p.product.id === s.value
                    );
                    const product = products?.find((p) => p.id === s.value);

                    return existing || { product: product!, quantity: 1 };
                })
            );
        } else {
            const sel = selected as Option | null;
            const customer = sel
                ? customers?.find((c) => c.id === sel.value) || null
                : null;

            setSelectedCustomer?.(customer);
        }
    };

    const getOptions = (): Option[] => {
        if (myValue === "Products") {
            return (productOptions || []).filter(
                (p) =>
                    !selectedProductsWithQty?.some(
                        (sel) => sel.product.id === p.value
                    )
            );
        }

        return customersOptions || [];
    };

    const getSelectedValue = (): Option | Option[] | null => {
        if (isMultiValue) {
            return (selectedProductsWithQty ?? []).map((p) => ({
                value: p.product.id,
                label: p.product.name,
            }));
        }

        if (!selectedCustomer) return null;

        return {
            value: selectedCustomer.id!,
            label: `${selectedCustomer.name} ${selectedCustomer.lastName}`,
        };
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
                <Autocomplete<Option, typeof isMultiValue>
                    fullWidth
                    multiple={isMultiValue}
                    options={getOptions()}
                    getOptionLabel={(option) => option.label}
                    value={getSelectedValue()}
                    onChange={handleChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={isMultiValue ? myValue : myValue.slice(0, -1)}
                            placeholder={`Select ${myValue === "Products" ? myValue : myValue.slice(0, -1)}...`}
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
                {myValue === "Products" &&
                    selectedProductsWithQty?.map((item, index) => (
                        <Stack direction="row" spacing={1} alignItems="end" key={item.product.id}>
                            <Box sx={{ width: 120, textAlign: "center" }}>{item.product.name}:</Box>
                            <TextField
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                                inputProps={{ min: 1 }}
                                sx={{
                                    width: 100,
                                    backgroundColor: "white",
                                    borderRadius: 2,
                                }}
                            />
                        </Stack>
                    ))}
            </Box>
    )
}

export default MySelect;
