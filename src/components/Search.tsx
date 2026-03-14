import {Fade, InputBase, Paper} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {SearchIcon, XIcon} from "lucide-react";
import {useState} from "react";
import type {Customer, OrderRow, Product} from "../types/Types.ts";
import {getProducts} from "../services/productService.ts";
import {getCustomers} from "../services/customerService.ts";
import {getOrders} from "../services/orderService.ts";

interface SearchProps {
    typeOf: string;
    setRows: React.Dispatch<React.SetStateAction<(Product | Customer | OrderRow)[]>>;
    page: number;
    pageSize: number;
    setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
    setSearchName: React.Dispatch<React.SetStateAction<string>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

const Search = ({typeOf, setRows, page, pageSize, setIsSearching, setSearchName, setPage}: SearchProps) => {
    const [text, setText] = useState("");

    const handleChange = (value: string) => {
        setText(value);
        if (value === "" && typeOf === "Products") {
            getProducts(page, pageSize)
                .then((data) => {
                    setRows(data.content);
                }).finally(()=>setIsSearching(false));
        }
        else if (value === "" && typeOf === "Customers"){
            getCustomers(page, pageSize)
                .then((data) => {
                    setRows(data.content);
                }).finally(()=>setIsSearching(false));
        } else if (value === "" && typeOf === "Orders"){
            getOrders(page, pageSize).then((data) => {
                const orders = data.content.map((order) => ({
                    id: order.id,
                    customer: `${order?.customer?.name ?? "Unknown"} ${order?.customer?.lastName ?? ""}`,
                    products: order.items,
                    address: order.address,
                    date: order.date ? new Date(order.date) : undefined
                }));
                setRows(orders);
            }).finally(()=>setIsSearching(false));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (typeOf === "Products") {
            setPage(0);
            setIsSearching(true);
            setSearchName(text);
        }
        else if (typeOf === "Customers"){
            setPage(0);
            setIsSearching(true);
            setSearchName(text);
        }
        else if (typeOf === "Orders") {
            setPage(0);
            setIsSearching(true);
            setSearchName(text);
        }
    }

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        setText("");
        if (typeOf === "Products") {
            getProducts(page, pageSize)
                .then((data) => {
                    setRows(data.content);
                }).finally(()=>setIsSearching(false));
        }
        else if (typeOf === "Customers"){
            getCustomers(page, pageSize)
                .then((data) => {
                    setRows(data.content);
                }).finally(()=>setIsSearching(false));
        } else if (typeOf === "Orders"){
            getOrders(page, pageSize).then((data) => {
                const orders = data.content.map((order) => ({
                    id: order.id,
                    customer: `${order?.customer?.name ?? "Unknown"} ${order?.customer?.lastName ?? ""}`,
                    products: order.items,
                    address: order.address,
                    date: order.date ? new Date(order.date) : undefined,
                }));
                setRows(orders);
            }).finally(()=>setIsSearching(false));
        }
    }

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
                    value={text}
                    onChange={(e)=>handleChange(e.target.value)}
                />
                <Fade in={Boolean(text)} timeout={200}>
                    <IconButton
                        type="button"
                        sx={{ p: '5px' }}
                        aria-label="reset"
                        onClick={handleReset}
                    >
                        <XIcon />
                    </IconButton>
                </Fade>
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search"
                    onClick={handleSubmit}
                >
                    <SearchIcon />
                </IconButton>
            </Paper>
    );
}

export default Search;