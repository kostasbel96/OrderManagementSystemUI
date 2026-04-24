import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableFooter,
    Paper,
    Button,
    TextField,
} from "@mui/material";
import { X } from "lucide-react";
import type {Product, SelectedProduct} from "../../types/Types.ts";
import ProductsAutocomplete from "./ProductsAutocomplete.tsx";

interface ProductsTableInsertProps {
    selectedProductsWithQty: SelectedProduct[];
    setSelectedProductsWithQty: React.Dispatch<React.SetStateAction<SelectedProduct[]>>;
}

const ProductsTableInsert = ({
                                          selectedProductsWithQty,
                                          setSelectedProductsWithQty,
                                      }: ProductsTableInsertProps) => {


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

    return (
        <TableContainer
            component={Paper}
            sx={{
                maxHeight: "calc(100vh - 69vh)",
                overflowX: "auto",
                overflowY: "auto",
            }}
        >
            <Table
                size="small"
                stickyHeader
                sx={{
                    tableLayout: "fixed",
                    minWidth: 900,
                }}
            >
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

                    const cellStyle = {
                        border: "1px solid #e0e0e0",
                        textAlign: "center",
                    };

                    return (
                        <>
                            {/* HEADER */}
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ ...cellStyle, width: col.index }} />

                                    <TableCell sx={{ ...cellStyle, width: col.product }}>
                                        Product
                                    </TableCell>

                                    <TableCell sx={{ ...cellStyle, width: col.description }}>
                                        Description
                                    </TableCell>

                                    <TableCell sx={{ ...cellStyle, width: col.qty }}>
                                        Qty
                                    </TableCell>

                                    <TableCell sx={{ ...cellStyle, width: col.price }}>
                                        Price
                                    </TableCell>

                                    <TableCell sx={{ ...cellStyle, width: col.total }}>
                                        Total
                                    </TableCell>

                                    <TableCell sx={{ ...cellStyle, width: col.action }} />
                                </TableRow>
                            </TableHead>

                            {/* BODY */}
                            <TableBody>
                                {selectedProductsWithQty.map((item, index) => (
                                    <TableRow
                                        key={item.id}
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "#fafafa",
                                            },
                                        }}
                                    >
                                        <TableCell sx={{ ...cellStyle, width: col.index }}>
                                            {index + 1}
                                        </TableCell>

                                        <TableCell sx={{ ...cellStyle, width: col.product }}>
                                            <ProductsAutocomplete
                                                selectedProduct={item.product}
                                                setSelectedProduct={(product: Product | null) => {
                                                    setSelectedProductsWithQty(prev =>
                                                        prev.map((row, i) =>
                                                            i === index
                                                                ? {
                                                                    ...row,
                                                                    product: product,
                                                                    price: product?.price ?? row.price,
                                                                }
                                                                : row
                                                        )
                                                    );
                                                }}
                                            />
                                        </TableCell>

                                        {/* DESCRIPTION */}
                                        <TableCell sx={{ ...cellStyle, width: col.description }}>
                                            <TextField
                                                multiline
                                                value={item.product?.description ?? ""}
                                                InputProps={{
                                                    readOnly: true
                                                }}
                                                sx={{
                                                    width: "100%",
                                                    minWidth: 260,
                                                    "& .MuiInputBase-root": {
                                                        fontSize: 11,
                                                    },
                                                    "& textarea": {
                                                        textAlign: "center",
                                                        whiteSpace: "pre-wrap",
                                                        wordBreak: "break-word",
                                                    },
                                                    "& .MuiOutlinedInput-root fieldset": {
                                                        border: "none",
                                                    },
                                                }}
                                            />
                                        </TableCell>

                                        {/* QTY */}
                                        <TableCell sx={{ ...cellStyle, width: col.qty }}>
                                            <TextField
                                                type="number"
                                                size="small"
                                                value={item.quantity === 0 ? "" : String(item.quantity)}
                                                onChange={(e:  React.ChangeEvent<HTMLInputElement>) => handleQuantityInputChange(e, index)}
                                                inputProps={{
                                                    min: 1,
                                                    style: { textAlign: "center" },
                                                }}
                                                sx={{
                                                    "& .MuiInputBase-root": {
                                                        fontSize: 11,
                                                        height: 35,
                                                    },
                                                    "& input": {
                                                        textAlign: "center",
                                                        padding: "4px 6px",
                                                    },
                                                    "& .MuiOutlinedInput-root fieldset": {
                                                        border: "none",
                                                    },
                                                }}
                                            />
                                        </TableCell>

                                        {/* PRICE */}
                                        <TableCell sx={{ ...cellStyle, width: col.price }}>
                                            <TextField
                                                type="number"
                                                size="small"
                                                value={item.price === null || item.price === undefined ? "" : String(item.price)}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    handlePriceInputChange(e, index);
                                                }}
                                                inputProps={{
                                                    step: "0.01",
                                                    style: { textAlign: "center" },
                                                }}
                                                sx={{
                                                    "& .MuiInputBase-root": {
                                                        fontSize: 11,
                                                        height: 30,
                                                    },
                                                    "& input": {
                                                        textAlign: "center",
                                                        padding: "4px 6px",
                                                    },
                                                    "& .MuiOutlinedInput-root fieldset": {
                                                        border: "none",
                                                    },
                                                }}
                                            />
                                        </TableCell>

                                        {/* TOTAL */}
                                        <TableCell sx={{ ...cellStyle, width: col.total }}>
                                            {(item.price * item.quantity).toFixed(2)}
                                        </TableCell>

                                        {/* ACTION */}
                                        <TableCell sx={{ ...cellStyle, width: col.action }}>
                                            <Button
                                                color="error"
                                                onClick={() => {
                                                    setSelectedProductsWithQty(prev =>
                                                        prev.filter((_, i) => i !== index)
                                                    );
                                                }}
                                            >
                                                <X size={16} />
                                            </Button>
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>

                            {/* FOOTER */}
                            <TableFooter>
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        sx={{
                                            border: "1px solid #e0e0e0",
                                            textAlign: "center",
                                        }}
                                    >
                                        <Button
                                            variant="outlined"
                                            onClick={() => {
                                                setSelectedProductsWithQty(prev => [
                                                    ...prev,
                                                    {
                                                        id: Date.now(),
                                                        product: null,
                                                        quantity: 1,
                                                        price: 0,
                                                    },
                                                ]);
                                            }}
                                        >
                                            Add Product
                                        </Button>
                                    </TableCell>
                                    <TableCell
                                        colSpan={4}
                                        sx={{
                                            border: "1px solid #e0e0e0",
                                            textAlign: "center",
                                            fontSize: "0.8rem"
                                        }}
                                    >
                                        {`Total Amount: ${selectedProductsWithQty
                                            .reduce((sum, item) => sum + (item.price * item.quantity), 0)
                                            .toFixed(2)}`}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>

                        </>
                    );
                })()}
            </Table>
        </TableContainer>
    );
}

export default ProductsTableInsert;