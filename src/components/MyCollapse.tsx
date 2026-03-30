import { Collapse, Paper, Box } from "@mui/material"
import FormProduct from "./FormProduct/FormProduct.tsx";
import FormOrder from "./FormOrder/FormOrder.tsx";
import FormCustomer from "./FormCustomer/FormCustomer.tsx";

interface OpenProps {
    isOpen: boolean;
    value: string;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    setPopUpMessage: React.Dispatch<React.SetStateAction<string>>;
}

const MyCollapse = ({isOpen, value, setSubmitted, setSuccess, setPopUpMessage}: OpenProps) => {

    return (
            <Collapse in={isOpen} sx={{maxWidth: 400, minWidth: 400}}>
                <Paper
                    elevation={6}
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "primary.main",
                        color: "white",
                        mb: 2,
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {value.includes("Product") && (
                            <FormProduct
                                value={value}
                                setSubmitted={setSubmitted}
                                setSuccess={setSuccess}
                                setPopUpMessage={setPopUpMessage}
                            />
                        )}

                        {value.includes("Order") && (
                            <FormOrder
                                setSubmitted={setSubmitted}
                                setSuccess={setSuccess}
                                setPopUpMessage={setPopUpMessage}
                            />
                        )}

                        {value.includes("Customer") && (
                            <FormCustomer
                                setPopUpMessage={setPopUpMessage}
                                value={value}
                                setSubmitted={setSubmitted}
                                setSuccess={setSuccess}
                            />
                        )}
                    </Box>
                </Paper>
            </Collapse>
    )
}

export default MyCollapse;