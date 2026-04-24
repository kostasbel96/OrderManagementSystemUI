import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField, Box, Stack,
} from "@mui/material";
import { X } from "lucide-react";
import type {Product, SelectedProduct} from "../../types/Types.ts";
import ProductsAutocomplete from "./ProductsAutocomplete.tsx";
import {useEffect, useRef, useState} from "react";

interface ProductsTableInsertProps {
    selectedProductsWithQty: SelectedProduct[];
    setSelectedProductsWithQty: React.Dispatch<React.SetStateAction<SelectedProduct[]>>;
    deposit?: string;
}

const ProductsTableInsert = ({
                                          selectedProductsWithQty,
                                          setSelectedProductsWithQty,
                                          deposit
                                      }: ProductsTableInsertProps) => {

    const [totalAmount, setTotalAmount] = useState<number>(0);
    const autocompleteRef = useRef<any>(null);
    const autocompleteRefs = useRef<Array<HTMLInputElement | null>>([]);

    const handleQuantityInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const value = e.target.value;

        const updated = [...selectedProductsWithQty];

        if (value === "") {
            updated[index].quantity = 0; // προσωρινό state
            setSelectedProductsWithQty(updated);
            return;
        }

        updated[index].quantity = Math.max(1, Number(value));
        setSelectedProductsWithQty(updated);
    };

    const handlePriceInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const value = e.target.value;

        const updated = [...selectedProductsWithQty];

        if (value === "") {
            updated[index].price = 0;
            setSelectedProductsWithQty(updated);
            return;
        }

        updated[index].price = Number(value);
        setSelectedProductsWithQty(updated);
    };

    const addRow = () => {
        setSelectedProductsWithQty(prev => {
            const newList = [
                ...prev,
                {
                    id: Date.now(),
                    product: undefined,
                    quantity: 1,
                    price: 0,
                },
            ];

            setTimeout(() => {
                const lastIndex = newList.length - 1;
                autocompleteRefs.current[lastIndex]?.focus();
            }, 0);

            return newList;
        });
    };

    useEffect(() => {
        const total = selectedProductsWithQty.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0
        );
        setTotalAmount(total);
    }, [selectedProductsWithQty]);




    const erpInputStyle = {
        "& .MuiOutlinedInput-root": {
            fontSize: 11,
            height: 26,

            // ❌ default no border
            "& fieldset": {
                border: "none",
            },

            // 🟡 hover border
            "&:hover fieldset": {
                border: "1px solid #ccc",
            },

            // 🔵 focus border
            "&.Mui-focused fieldset": {
                border: "1px solid #1976d2",
            },
        },

        "& input": {
            padding: "2px 6px",
            textAlign: "right",
        },

        // 🔥 remove spinners
        "& input[type=number]::-webkit-outer-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
            textAlign: "center",
        },
        "& input[type=number]::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
            textAlign: "center",
        },
        "& input[type=number]": {
            MozAppearance: "textfield",
            textAlign: "center",
        },
    };

    return (

        <>
            <Stack direction="row" justifyContent="flex-start" sx={{ mt: 1 }}>
                <Button variant="outlined" size="small" onClick={addRow}>
                    Add Product
                </Button>
            </Stack>
            <TableContainer
                component={Paper}
                sx={{
                    height: "38vh",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                <Box sx={{ flex: 1, overflow: "auto" }}>
                    <Table size="small" stickyHeader sx={{ tableLayout: "fixed", minWidth: 900 }}>
                    {(() => {
                        const col = {
                            index: 50,
                            product: 300,
                            description: 260,
                            qty: 70,
                            price: 80,
                            total: 80,
                            action: 60,
                        };

                        return (
                            <>
                                {/* HEADER */}
                                <TableHead>
                                    <TableRow>
                                        {[
                                            "",
                                            "Product",
                                            "Description",
                                            "Qty",
                                            "Price",
                                            "Total",
                                            "",
                                        ].map((h, i) => (
                                            <TableCell
                                                key={`${h}-${i}`}
                                                sx={{
                                                    borderBottom: "1px solid #d0d0d0",
                                                    fontSize: 11,
                                                    fontWeight: 600,
                                                    backgroundColor: "#f5f5f5",
                                                    width: Object.values(col)[i],
                                                    textAlign: "center",
                                                    py: 1,
                                                }}
                                            >
                                                {h}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>

                                {/* BODY */}
                                <TableBody>
                                    {selectedProductsWithQty.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} sx={{ height: "100%" }}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        width: "100%",
                                                        height: "100%",
                                                        color: "#999",
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    No products added
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        selectedProductsWithQty.map((item, index) => (
                                            <TableRow
                                                key={item.id}
                                                sx={{
                                                    "& td": {
                                                        borderBottom: "1px solid #eee",
                                                        fontSize: 11,
                                                        py: 0.5,
                                                    },
                                                    "&:hover": {
                                                        backgroundColor: "#fafafa",
                                                    },
                                                }}
                                            >
                                                <TableCell sx={{ textAlign: "center" }}>
                                                    {index + 1}
                                                </TableCell>

                                                <TableCell>
                                                    <ProductsAutocomplete
                                                        inputRef={(el) => (autocompleteRefs.current[index] = el)}
                                                        selectedProduct={item.product}
                                                        setSelectedProduct={(product: Product | null) => {
                                                            setSelectedProductsWithQty((prev: SelectedProduct[]) =>
                                                                prev.map((row, i) =>
                                                                    i === index
                                                                        ? {
                                                                            ...row,
                                                                            product: product || undefined,
                                                                            price: product?.price ?? row.price,
                                                                        }
                                                                        : row
                                                                )
                                                            );
                                                            // 👇 focus μετά την επιλογή
                                                            setTimeout(() => {
                                                                autocompleteRef.current?.querySelector("input")?.focus();
                                                            }, 0);
                                                        }}
                                                        selectedProductsWithQty={selectedProductsWithQty}

                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    <Box sx={{ fontSize: 11, color: "#444", textAlign: "center" }}>
                                                        {item.product?.description ?? "-"}
                                                    </Box>
                                                </TableCell>

                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        inputProps={{
                                                            min: 1
                                                        }}
                                                        onFocus={(e) => e.target.select()}
                                                        value={item.quantity || ""}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuantityInputChange(e, index)}
                                                        size="small"
                                                        sx={erpInputStyle}
                                                    />
                                                </TableCell>

                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        onFocus={(e) => e.target.select()}
                                                        value={item.price === null || item.price === undefined ? "" : String(item.price)}
                                                        inputProps={{
                                                            min: 0,
                                                            inputMode: "decimal",
                                                            pattern: "[0-9]*[.,]?[0-9]*"
                                                        }}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePriceInputChange(e, index)}
                                                        size="small"
                                                        sx={erpInputStyle}
                                                    />
                                                </TableCell>

                                                <TableCell sx={{ textAlign: "center", fontWeight: 500 }}>
                                                    {(item.price * item.quantity).toFixed(2)}
                                                </TableCell>

                                                <TableCell sx={{ textAlign: "center" }}>
                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        sx={{ minWidth: 0 }}
                                                        onClick={() =>
                                                            setSelectedProductsWithQty(prev =>
                                                                prev.filter((_, i) => i !== index)
                                                            )
                                                        }
                                                    >
                                                        <X size={14} />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}

                                </TableBody>
                            </>
                        );
                    })()}
                </Table>

                </Box>

            </TableContainer>
            <Box
                sx={{
                    borderTop: "1px solid #d0d0d0",
                    backgroundColor: "#f5f5f5",

                    // 👇 important: match table width behavior
                    width: "100%",
                    boxSizing: "border-box",

                    // 👇 align like table row
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",

                    // 👇 ERP spacing (less airy, more grid-like)
                    gap: 6,
                    px: 2,
                    py: 0.8,

                    fontSize: 11,
                    fontFamily: "inherit",
                }}
            >
                {/* TOTAL */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        minWidth: 120,
                    }}
                >
                    <Box sx={{ color: "#666", fontSize: 10 }}>Total</Box>
                    <Box sx={{ fontWeight: 700, color: "#111" }}>
                        {totalAmount.toFixed(2)}
                    </Box>
                </Box>

                {/* BALANCE */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        minWidth: 120,
                    }}
                >
                    <Box sx={{ color: "#666", fontSize: 10 }}>Balance</Box>
                    <Box
                        sx={{
                            fontWeight: 700,
                            color:
                                totalAmount - Number(deposit ?? 0) > 0
                                    ? "#d32f2f"
                                    : "#2e7d32",
                        }}
                    >
                        {(totalAmount - Number(deposit ?? 0)).toFixed(2)}
                    </Box>
                </Box>
            </Box>
        </>


    );
}

export default ProductsTableInsert;