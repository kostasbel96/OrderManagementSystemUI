import { Tabs, Tab, Paper, Box } from "@mui/material";
import {useEffect, useState} from "react";
import { useTranslation } from 'react-i18next';
import FormProduct from "./products/FormProduct/FormProduct";
import FormOrder from "./orders/FormOrder/FormOrder";
import FormCustomer from "./customers/FormCustomer/FormCustomer";
import FormRoute from "./routes/FormRoute.tsx";

type FormType = "product" | "order" | "customer" | "route";

interface Props {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    setPopUpMessage: React.Dispatch<React.SetStateAction<string>>;
    setActiveValue: React.Dispatch<React.SetStateAction<string | null>>;
}

const MyTabs = ({ setSubmitted, setSuccess, setPopUpMessage, setActiveValue }: Props) => {
    const [tab, setTab] = useState<FormType>("product");
    const { t } = useTranslation();

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
                <Tab label={t('tabs.product')} value="product" />
                <Tab label={t('tabs.order')} value="order" />
                <Tab label={t('tabs.customer')} value="customer" />
                <Tab label={t('tabs.route')} value="route"/>
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
                {tab === "route" && (
                    <FormRoute
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