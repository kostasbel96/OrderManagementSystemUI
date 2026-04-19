import {Fade, InputBase, Paper} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {SearchIcon, XIcon} from "lucide-react";
import {useState} from "react";

interface SearchProps {
    typeOf: string;
    setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
    setSearchName: React.Dispatch<React.SetStateAction<string>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

const Search = ({typeOf, setIsSearching, setSearchName, setPage}: SearchProps) => {
    const [text, setText] = useState("");

    const handleChange = (value: string) => {
        setText(value);
        if (value === "") {
            setIsSearching(false);
            setPage(0);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(0);
        setIsSearching(true);
        setSearchName(text);
    }

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(0);
        setIsSearching(false);
        setSearchName("");
        setText("");
    }

    return(
            <Paper
                component="form"
                onSubmit={handleSubmit}
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: {
                        xs: '100%',
                        sm: 500,
                        md: 500
                    },
                    maxWidth: '100%' }}
            >
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder={`Search ${typeOf === "Orders" ? " customer by address, id, name, phone " : typeOf}`}
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