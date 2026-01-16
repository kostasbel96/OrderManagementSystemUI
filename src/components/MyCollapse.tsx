import { Collapse, Paper, Box } from "@mui/material"
import FormProduct from "./FormProduct/FormProduct.tsx";
import FormOrder from "./FormOrder/FormOrder.tsx";
import FormCustomer from "./FormCustomer/FormCustomer.tsx";

interface OpenProps {
    isOpen: boolean;
    value: string;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const MyCollapse = ({isOpen, value, setSubmitted, setSuccess}: OpenProps) => {

    return (
        <>
            <Collapse in={isOpen}>
                <Paper
                    elevation={6}
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "primary.main", // μπλε Material
                        color: "white",
                        mb: 2,
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {value.includes("Product") && (
                            <FormProduct
                                value={value}
                                setSubmitted={setSubmitted}
                                setSuccess={setSuccess}
                            />
                        )}

                        {value.includes("Order") && (
                            <FormOrder
                                setSubmitted={setSubmitted}
                                setSuccess={setSuccess}
                            />
                        )}

                        {value.includes("Customer") && (
                            <FormCustomer
                                value={value}
                                setSubmitted={setSubmitted}
                                setSuccess={setSuccess}
                            />
                        )}
                    </Box>
                </Paper>
            </Collapse>

        </>
    )
}

export default MyCollapse;