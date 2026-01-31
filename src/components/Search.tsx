import {InputBase, Paper} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {SearchIcon} from "lucide-react";
import {useState} from "react";
import type {Customer, OrderRow, Product} from "../types/Types.ts";
import {getProducts, searchProductByName} from "../services/productService.ts";
import {getCustomers, searchCustomerByName} from "../services/customerService.ts";
import {getOrders, searchOrderByCustomerName} from "../services/OrderService.ts";

interface SearchProps {
    typeOf: string;
    setRows: React.Dispatch<React.SetStateAction<(Product | Customer | OrderRow)[]>>;
    page: number;
    pageSize: number;
}

const Search = ({typeOf, setRows, page, pageSize}: SearchProps) => {
    const [text, setText] = useState("");

    const handleChange = (value: string) => {
        setText(value);
        if (value === "" && typeOf === "Products") {
            getProducts(page, pageSize)
                .then((data) => {
                    setRows(data.content);
                })
        }
        else if (value === "" && typeOf === "Customers"){
            getCustomers(page, pageSize)
                .then((data) => {
                    setRows(data.content);
                })
        } else if (value === "" && typeOf === "Orders"){
            getOrders(page, pageSize).then((data) => {
                const orders = data.content.map((order) => ({
                    id: order.id,
                    customer: `${order?.customer?.name ?? "Unknown"} ${order?.customer?.lastName ?? ""}`,
                    products: order.items.map(p => p.product.name).join("\n"),
                    quantity: order.items.map(p => p.quantity).join("\n"),
                    address: order.address,
                    date: order.date,
                }));
                setRows(orders);
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (typeOf === "Products") {
            searchProductByName(text).then((products: Product[]) => {
                setRows(products);
            })
        }
        else if (typeOf === "Customers"){
            searchCustomerByName(text).then((customers: Customer[]) => {
                setRows(customers);
            })
        }
        else if (typeOf === "Orders"){
            // Note: searchOrderByCustomerName relies on a local array in OrderService which might be empty.
            // If you have a backend search endpoint, you should use it here.
            searchOrderByCustomerName(text).then((data) => {
                const orders = data.map((order) => ({
                    id: order.id,
                    customer: `${order?.customer?.name ?? "Unknown"} ${order?.customer?.lastName ?? ""}`,
                    products: order.items.map(p => p.product.name).join("\n"),
                    quantity: order.items.map(p => p.quantity).join("\n"),
                    address: order.address,
                    date: order.date,
                }));
                setRows(orders);
            });
        }
    };

    return(
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
    );
}

export default Search;