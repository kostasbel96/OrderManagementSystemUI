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


    return (
        <TableContainer
            component={Paper}
            sx={{
                maxHeight: "calc(100vh - 68vh)",
                overflowY: "scroll",
                width: "100%",
            }}
        >
            <Table
                size="small"
                stickyHeader
                sx={{
                    tableLayout: "fixed",
                    width: "100%",
                }}
            >
                {/* HEADER */}
                <TableHead>
                    <TableRow>
                        <TableCell align="center" />
                        <TableCell align="center">Product</TableCell>
                        <TableCell align="center">Qty</TableCell>
                        <TableCell align="center">Price</TableCell>
                        <TableCell align="center">Total</TableCell>
                        <TableCell align="center" />
                    </TableRow>
                </TableHead>

                {/* BODY */}
                <TableBody>
                    {selectedProductsWithQty.map((item: SelectedProduct, index: number) => (
                        <TableRow key={item.id}>

                            <TableCell align="center">{index + 1}</TableCell>

                            <TableCell align="center">
                                <ProductsAutocomplete
                                    selectedProduct={item.product}
                                    setSelectedProduct={(product: Product | null) => {
                                        setSelectedProductsWithQty(prev =>
                                            prev.map((row, i) =>
                                                i === index
                                                    ? { ...row,
                                                        product: product,
                                                        price: product?.price ?? row.price,
                                                    }
                                                    : row
                                            )
                                        );
                                    }}
                                />
                            </TableCell>

                            <TableCell align="center">
                                <TextField
                                    type="number"
                                    size="small"
                                    value={item.quantity}
                                    onChange={(e) => {
                                        const updated = [...selectedProductsWithQty];
                                        updated[index].quantity = Number(e.target.value);
                                        setSelectedProductsWithQty(updated);
                                    }}
                                    inputProps={{
                                        min: 1
                                    }}
                                    sx={{
                                        width: 70,
                                        "& .MuiInputBase-root": {
                                            fontSize: 11,
                                            height: 30,
                                        },
                                        "& input": {
                                            padding: "4px 6px",
                                            fontSize: 11,
                                        },
                                    }}
                                />
                            </TableCell>

                            <TableCell align="center">
                                <TextField
                                    type="number"
                                    size="small"
                                    value={item.price}
                                    onChange={(e) => {
                                        const updated = [...selectedProductsWithQty];
                                        updated[index].price = Number(e.target.value);
                                        setSelectedProductsWithQty(updated);
                                    }}
                                    inputProps={{
                                        min: 0,
                                        step: "0.01"
                                    }}
                                    sx={{
                                        width: 90,
                                        "& .MuiInputBase-root": {
                                            fontSize: 11,
                                            height: 30,
                                        },
                                        "& input": {
                                            padding: "4px 6px",
                                            fontSize: 11,
                                        },
                                    }}
                                />
                            </TableCell>

                            <TableCell align="center">
                                {(item.price * item.quantity).toFixed(2)}
                            </TableCell>

                            <TableCell align="center">
                                <Button
                                    color="error"
                                    onClick={() => {
                                        setSelectedProductsWithQty((prev: SelectedProduct[]) =>
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
                        <TableCell colSpan={6} align="center">
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setSelectedProductsWithQty((prev: SelectedProduct[]) => [
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
                    </TableRow>
                </TableFooter>

            </Table>
        </TableContainer>
    );
}

export default ProductsTableInsert;