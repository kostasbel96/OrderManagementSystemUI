import {InputBase, Paper} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {SearchIcon} from "lucide-react";
import {useState} from "react";
import type {Customer, OrderRow, Product} from "../types/Types.ts";
import {getProducts, searchProduct} from "../services/productService.ts";
import {getCustomers, searchCustomer} from "../services/customerService.ts";
import {getOrders, searchOrderByCustomerName} from "../services/OrderService.ts";

interface SearchProps {
    typeOf: string;
    setRows: React.Dispatch<React.SetStateAction<(Product | Customer | OrderRow)[]>>;
}

const Search = ({typeOf, setRows}: SearchProps) => {
    const [text, setText] = useState("");

    const handleChange = (value: string) => {
        setText(value);
        if (value === "" && typeOf === "Products") {
            setRows(getProducts());
        }
        else if (value === "" && typeOf === "Customers"){
            setRows(getCustomers());
        } else if (value === "" && typeOf === "Orders"){
            const orders = getOrders().map((order) => ({
                id: order.id,
                customer: `${order?.customer?.name ?? "Unknown"} ${order?.customer?.lastName ?? ""}`,
                products: order.products.map(p => p.product.name).join("\n"),
                quantity: order.products.map(p => p.quantity).join("\n"),
                address: order.address,
                date: order.date,
            }));
            setRows(orders != undefined ? orders: []);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (typeOf === "Products") {
            setRows(searchProduct(text));
        }
        else if (typeOf === "Customers"){
            setRows(searchCustomer(text));
        }
        else if (typeOf === "Orders"){
            setRows(searchOrderByCustomerName(text).map((order) => ({
                id: order.id,
                customer: `${order?.customer?.name ?? "Unknown"} ${order?.customer?.lastName ?? ""}`,
                products: order.products.map(p => p.product.name).join("\n"),
                quantity: order.products.map(p => p.quantity).join("\n"),
                address: order.address,
                date: order.date,
            })));
        }
    };

    return(
        <>
            <Paper
                component="form"
                onSubmit={handleSubmit}
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: {
                        xs: '100%',
                        sm: 300,
                        md: 400
                    },
                    maxWidth: '100%' }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder={`Search ${typeOf === "Orders" ? "by customer name" : typeOf}`}
                    inputProps={{ 'aria-label': 'search google maps' }}
                    onChange={(e)=>handleChange(e.target.value)}
                />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search"
                    onClick={handleSubmit}
                >
                    <SearchIcon />
                </IconButton>
            </Paper>
        </>
    );
}

export default Search;