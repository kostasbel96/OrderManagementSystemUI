import type {Customer, Driver, OrderItem, Product, Receipt, Route, Supplier} from "../../../types/Types.ts";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import Alert from "@mui/material/Alert";
import {useEffect, useState} from "react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

interface PopUpItemDeletedProps {
    typeOf: string;
    item: Product | Customer | OrderItem | Driver | Route | Receipt | Supplier;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    operation: string;
}

const PopUpItemOperation = ({item, typeOf, setSubmitted, operation} : PopUpItemDeletedProps) => {
    const [operationItem, setOperationItem] = useState<Product | Customer | OrderItem | Driver | Route | Receipt | Supplier>();
    const [progress, setProgress] = useState(100);
    const [isPaused, setIsPaused] = useState(false);
    const duration = 3000;
    const { t } = useTranslation();

    useEffect(() => {
        if (typeOf === "product"){
            setOperationItem(item as Product);
        } else if (typeOf === "customer"){
            setOperationItem(item as Customer);
        } else if (typeOf === "order") {
            setOperationItem(item as OrderItem);
        } else if (typeOf === "driver") {
            setOperationItem(item as Driver);
        } else if (typeOf === "receipt") {
            setOperationItem(item as Receipt);
        } else if (typeOf === "route") {
            setOperationItem(item as Route);
        } else if (typeOf === "supplier") {
            setOperationItem(item as Supplier);
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
                    setTimeout(() => setSubmitted(false), 0);
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
                {operationItem && (() => {
                    const displayType = t(`typeNames.${typeOf}`);
                    let subject = "";
                    switch(typeOf) {
                        case 'product':
                            subject = (operationItem as Product).name;
                            break;
                        case 'customer':
                            subject = `${(operationItem as Customer).name} ${(operationItem as Customer).lastName}`;
                            break;
                        case 'order':
                            subject = String((operationItem as OrderItem).id);
                            break;
                        case 'driver':
                            subject = `${(operationItem as Driver).name} ${(operationItem as Driver).lastName}`;
                            break;
                        case 'route':
                            subject = String((operationItem as Route).id);
                            break;
                        case 'receipt':
                            subject = String((operationItem as Receipt).id);
                            break;
                        case 'supplier':
                            subject = String((operationItem as Supplier).id);
                            break;
                        default:
                            subject = "";
                    }

                    const op = t(`ops.${operation}`, { defaultValue: operation });
                    return t('messages_ext.operationSuccess', { type: displayType, subject, operation: op });
                })()}
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