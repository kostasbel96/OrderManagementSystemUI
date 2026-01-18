import { Autocomplete, TextField, Box, Stack } from "@mui/material"
import type {Customer, Product} from "../../types/Types.ts";

interface SelectProps {
    myValue: string;
    isMultiValue: boolean;
    products?: Product[];
    customers?: Customer[];
    selectedProductsWithQty?: SelectedProduct[];
    selectedCustomer?: Customer | null;
    setSelectedProductsWithQty?: React.Dispatch<React.SetStateAction<SelectedProduct[]>>
    setSelectedCustomer?: React.Dispatch<React.SetStateAction<Customer | null>>
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
                                                  products,
                                                  customers,
                                                  selectedProductsWithQty,
                                                  selectedCustomer,
                                                  setSelectedProductsWithQty,
                                                  setSelectedCustomer} : SelectProps) => {


    const productOptions = products?.
                                                            filter(p => p.quantity > 0).
                                                            map(p => ({
                                                                value: p.id,
                                                                label: p.name
                                                            }));
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


    return (
        <>

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                {/* Autocomplete Select */}
                <Autocomplete<Option, typeof isMultiValue>
                    multiple={isMultiValue}
                    options={
                        myValue === "Products"
                            ? (productOptions || []).filter(
                                (p) => !selectedProductsWithQty?.some((sel) => sel.product.id === p.value)
                            )
                            : customersOptions || []
                    }
                    getOptionLabel={(option) => option.label}
                    value={
                        isMultiValue
                            ? selectedProductsWithQty?.map((p) => ({
                            value: p.product.id,
                            label: p.product.name,
                        })) || []
                            : selectedCustomer
                                ? { value: selectedCustomer.id!, label: `${selectedCustomer.name} ${selectedCustomer.lastName}` }
                                : null
                    }
                    onChange={(_, selected) => {
                        if (isMultiValue) {
                            const selectedArray = Array.isArray(selected) ? selected : [];
                            setSelectedProductsWithQty?.(
                                selectedArray.map((s) => {
                                    const existing = selectedProductsWithQty?.find((p) => p.product.id === s.value);
                                    const product = products?.find((p) => p.id === s.value);
                                    return existing || { product: product!, quantity: 1 };
                                })
                            );
                        } else {
                            const sel = selected as Option | null;
                            const customer = sel ? customers?.find((c) => c.id === sel.value) || null : null;
                            setSelectedCustomer?.(customer);
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={isMultiValue ? myValue : myValue.slice(0, -1)}
                            placeholder={`Select ${myValue === "Products" ? myValue : myValue.slice(0, -1)}...`}
                            sx={{
                                width: 250,
                                backgroundColor: "white",
                                borderRadius: 2,
                                '& .MuiInputLabel-root': {
                                    backgroundColor: 'white',
                                    borderRadius: 2,
                                    padding: "5px"
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'gray',
                                    backgroundColor: 'white',
                                    borderRadius: 2,
                                    padding: "5px",
                                }
                            }}
                        />
                    )}
                    sx={{ width: 250 }}
                />

                {/* Quantity inputs for Products */}
                {myValue === "Products" &&
                    selectedProductsWithQty?.map((item, index) => (
                        <Stack direction="row" spacing={2} alignItems="center" key={item.product.id}>
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
        </>
    )
}

export default MySelect;
