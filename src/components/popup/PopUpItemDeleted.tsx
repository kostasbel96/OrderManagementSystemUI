import type {Customer, OrderRow, Product} from "../../types/Types.ts";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import Alert from "@mui/material/Alert";
import {useEffect, useState} from "react";

interface PopUpItemDeletedProps {
    typeOf: string;
    item: Product | Customer | OrderRow;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

const PopUpItemDeleted = ({item, typeOf, setSubmitted} : PopUpItemDeletedProps) => {
    const [deletedItem, setDeletedItem] = useState<Product | Customer | OrderRow>();

    useEffect(() => {
        if (typeOf === "product"){
            setDeletedItem(item as Product);
        } else if (typeOf === "customer"){
            setDeletedItem(item as Customer);
        } else if (typeOf === "order") {
            setDeletedItem(item as OrderRow);
        }
    }, []);

    return (
        <Alert
            severity="success"
            variant="filled"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
            action={
                <IconButton
                    color="inherit"
                    size="small"
                    onClick={() => setSubmitted(false)}
                    sx={{ mb: 1 }}
                >
                    <CheckIcon />
                </IconButton>
            }
        >
            { (typeOf === "product" && deletedItem) && (`Product ${(deletedItem as Product).name} deleted successfully!` ) }
            { (typeOf === "customer" && deletedItem) && (`Customer ${(deletedItem as Customer).name} ${(deletedItem as Customer).lastName} deleted successfully!` ) }
            { (typeOf === "order" && deletedItem) && (`Order ${(deletedItem as OrderRow).id} deleted successfully!` ) }
        </Alert>
            )
}

export default PopUpItemDeleted;