import {Fade, InputBase, Paper} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {SearchIcon, XIcon} from "lucide-react";
import {useCallback, useState} from "react";
import { useTranslation } from 'react-i18next';
import type {GridPaginationModel} from "@mui/x-data-grid";

interface SearchProps {
    typeOf: string;
    setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
    setSearchName: React.Dispatch<React.SetStateAction<string>>;
    setPaginationModel: React.Dispatch<React.SetStateAction<GridPaginationModel>>
}

const Search = ({typeOf, setIsSearching, setSearchName, setPaginationModel}: SearchProps) => {
    const [text, setText] = useState("");
    const { t } = useTranslation();

    const getPlaceholder = useCallback(() => {
        if (typeOf === "orderCustomer") {
            return t('search2.searchCustomer');
        } else if (typeOf === "orderSupplier") {
            return t('search2.searchSupplier');
        } else if (typeOf === "Products"){
            return t('search2.searchProduct');
        } else if (typeOf === "Drivers") {
            return t('search2.searchDriver');
        } else if (typeOf === "Suppliers") {
            return t('search2.searchSupplier');
        } else if (typeOf === "receipt") {
            return t('search2.searchCustomer');
        } else if (typeOf === "payment") {
            return t('search2.searchSupplier');
        } else if (typeOf === "Routes") {
            return t('search2.searchRoute');
        } else if (typeOf === "Customers") {
            return t('search2.searchCustomer');
        }
    }, [typeOf])

    const handleChange = (value: string) => {
        setText(value);
        if (value === "") {
            setIsSearching(false);
            setPaginationModel((prev) => ({...prev, page: 0}))
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPaginationModel((prev) => ({...prev, page: 0}))
        setIsSearching(true);
        setSearchName(text);
    }

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        setPaginationModel((prev) => ({...prev, page: 0}))
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
                    placeholder={getPlaceholder()}
                    inputProps={{ 'aria-label': t('search.ariaSearch') }}
                    value={text}
                    onChange={(e)=>handleChange(e.target.value)}
                />
                <Fade in={Boolean(text)} timeout={200}>
                    <IconButton
                        type="button"
                        sx={{ p: '5px' }}
                        aria-label={t('search.ariaReset')}
                        onClick={handleReset}
                    >
                        <XIcon />
                    </IconButton>
                </Fade>
                <IconButton type="button" sx={{ p: '10px' }} aria-label={t('search.ariaSearch')}
                    onClick={handleSubmit}
                >
                    <SearchIcon />
                </IconButton>
            </Paper>
    );
}

export default Search;