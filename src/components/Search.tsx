import {InputBase, Paper} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {SearchIcon} from "lucide-react";
import {useState} from "react";
import type {Product} from "../types/Types.ts";
import {getProducts, search} from "../services/productService.ts";

interface SearchProps {
    type: string;
    setRows: React.Dispatch<React.SetStateAction<Product[]>>;
}

const Search = ({type, setRows}: SearchProps) => {
    const [text, setText] = useState("");

    const handleChange = (value: string) => {
        setText(value);

        if (value === "") {
            setRows(getProducts());
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setRows(search(text))
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
                    placeholder={`Search ${type}`}
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