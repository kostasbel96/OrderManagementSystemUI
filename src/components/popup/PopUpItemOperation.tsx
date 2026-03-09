import type {Customer, OrderItem, Product} from "../../types/Types.ts";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import Alert from "@mui/material/Alert";
import {useEffect, useState} from "react";

interface PopUpItemDeletedProps {
    typeOf: string;
    item: Product | Customer | OrderItem;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    operation: string;
}

const PopUpItemOperation = ({item, typeOf, setSubmitted, operation} : PopUpItemDeletedProps) => {
    const [operationItem, setOperationItem] = useState<Product | Customer | OrderItem>();

    useEffect(() => {
        if (typeOf === "product"){
            setOperationItem(item as Product);
        } else if (typeOf === "customer"){
            setOperationItem(item as Customer);
        } else if (typeOf === "order") {
            setOperationItem(item as OrderItem);
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
            { (typeOf === "product" && operationItem) && 
                (`Product ${(operationItem as Product).name} ${operation} successfully!` ) }
            { (typeOf === "customer" && operationItem) && 
                (`Customer ${(operationItem as Customer).name} ${(operationItem as Customer).lastName} ${operation} successfully!` ) }
            { (typeOf === "order" && operationItem) && (`Order ${(operationItem as OrderItem).id} ${operation} successfully!` ) }
        </Alert>
            )
}

export default PopUpItemOperation;