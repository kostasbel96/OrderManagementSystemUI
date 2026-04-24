import { Tabs, Tab, Paper, Box } from "@mui/material";
import {useEffect, useState} from "react";
import FormProduct from "./FormProduct/FormProduct";
import FormOrder from "./FormOrder/FormOrder";
import FormCustomer from "./FormCustomer/FormCustomer";

type FormType = "product" | "order" | "customer";

interface Props {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    setPopUpMessage: React.Dispatch<React.SetStateAction<string>>;
    setActiveValue: React.Dispatch<React.SetStateAction<string | null>>;
}

const MyTabs = ({ setSubmitted, setSuccess, setPopUpMessage, setActiveValue }: Props) => {
    const [tab, setTab] = useState<FormType>("product");

    const handleChange = (_: React.SyntheticEvent, newValue: FormType) => {
        setTab(newValue);
    };

    useEffect(() => {
        setActiveValue(tab);
        setSubmitted(false);
    }, [tab]);

    return (
        <Paper
            elevation={6}
            sx={{
                width: "100%",
                marginTop: 0,
                marginBottom: 0,
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "white",
            }}
        >
            {/* Tabs */}
            <Tabs
                value={tab}
                onChange={handleChange}
                textColor="inherit"
                indicatorColor="secondary"
                variant="fullWidth"
            >
                <Tab label="Product" value="product" />
                <Tab label="Order" value="order" />
                <Tab label="Customer" value="customer" />
            </Tabs>

            {/* Content */}
            <Box sx={{ mt: 1 }}>
                {tab === "product" && (
                    <FormProduct
                        setSubmitted={setSubmitted}
                        setSuccess={setSuccess}
                        setPopUpMessage={setPopUpMessage}
                    />
                )}

                {tab === "order" && (
                    <FormOrder
                        setSubmitted={setSubmitted}
                        setSuccess={setSuccess}
                        setPopUpMessage={setPopUpMessage}
                    />
                )}

                {tab === "customer" && (
                    <FormCustomer
                        setSubmitted={setSubmitted}
                        setSuccess={setSuccess}
                        setPopUpMessage={setPopUpMessage}
                    />
                )}
            </Box>
        </Paper>
    );
};

export default MyTabs;