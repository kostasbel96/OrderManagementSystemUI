import type {Customer, Driver, OrderItem, Product} from "../../../types/Types.ts";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import Alert from "@mui/material/Alert";
import {useEffect, useState} from "react";
import { motion } from "framer-motion";

interface PopUpItemDeletedProps {
    typeOf: string;
    item: Product | Customer | OrderItem | Driver;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    operation: string;
}

const PopUpItemOperation = ({item, typeOf, setSubmitted, operation} : PopUpItemDeletedProps) => {
    const [operationItem, setOperationItem] = useState<Product | Customer | OrderItem | Driver>();
    const [progress, setProgress] = useState(100);
    const [isPaused, setIsPaused] = useState(false);
    const duration = 3000;

    useEffect(() => {
        if (typeOf === "product"){
            setOperationItem(item as Product);
        } else if (typeOf === "customer"){
            setOperationItem(item as Customer);
        } else if (typeOf === "order") {
            setOperationItem(item as OrderItem);
        } else if (typeOf === "driver") {
            setOperationItem(item as Driver);
        }
    }, []);



    useEffect(() => {
        if (isPaused) return;

        const interval = 30;
        const step = 100 / (duration / interval);

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev - step;

                if (next <= 0) {
                    clearInterval(timer);
                    setSubmitted(false);
                    return 0;
                }

                return next;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [isPaused]);

    return (
        <motion.div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
                position: "fixed",
                bottom: 20,
                right: 20,
                zIndex: 9999,
            }}
        >
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
                { (typeOf === "driver" && operationItem) &&
                    (`Driver ${(operationItem as Driver).name} ${(operationItem as Driver).lastName} ${operation} successfully!` ) }
                <div
                    style={{
                        height: 4,
                        background: "#ddd",
                        marginTop: 10,
                        borderRadius: 4,
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            width: `${progress}%`,
                            height: "100%",
                            background: "green",
                            transition: "width 0.03s linear",
                        }}
                    />
                </div>
            </Alert>

        </motion.div>

            )
}

export default PopUpItemOperation;