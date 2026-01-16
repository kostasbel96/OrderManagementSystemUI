import {type FormEvent, useState} from "react";
import {addProduct} from "../../services/productService.ts";
import { Box, TextField, Button, Stack } from "@mui/material"

interface FormProductProps {
    value: string;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormProduct = ({value, setSubmitted, setSuccess}: FormProductProps) => {
    const [productQuantity, setProductQuantity] = useState(1);
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addProduct({
            id: -1,
            name: productName,
            description: productDescription,
            quantity: productQuantity
        })
        setProductQuantity(1);
        setProductName("");
        setProductDescription("");
        setSubmitted(true);
        setSuccess(true);
    }

    const handleOnReset = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProductQuantity(1);
        setProductName("");
        setProductDescription("");
    }

    return (
        <>
            <Box
                component="form"
                onSubmit={handleOnSubmit}
                onReset={handleOnReset}
                sx={{
                    p: 5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    width: "100%",
                }}
            >
                {/* Product Name */}
                <TextField
                    label={value.split(" ")[1]}
                    placeholder={value.split(" ")[1]}
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    variant="outlined"
                    sx={{
                        width: 300,
                        backgroundColor: "white",
                        borderRadius: 2,
                        '& .MuiInputLabel-root': {
                            backgroundColor: 'white',
                            borderRadius: 2,
                            padding: "5px"
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'gray',
                            backgroundColor: 'white',
                            borderRadius: 2,
                            padding: "5px",
                        }
                    }}
                />

                {/* Description */}
                <TextField
                    label="Description"
                    placeholder="Description"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    variant="outlined"
                    sx={{
                        width: 300,
                        backgroundColor: "white",
                        borderRadius: 2,
                        '& .MuiInputLabel-root': {
                            backgroundColor: 'white',
                            borderRadius: 2,
                            padding: "5px"
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'gray',
                            backgroundColor: 'white',
                            borderRadius: 2,
                            padding: "5px",
                        }
                    }}
                />

                {/* Quantity */}
                <TextField
                    label="Quantity"
                    type="number"
                    inputProps={{ min: 1 }}
                    placeholder="Quantity in stock"
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(Number(e.target.value))}
                    variant="outlined"
                    sx={{
                        width: 300,
                        backgroundColor: "white",
                        borderRadius: 2,
                        '& .MuiInputLabel-root': {
                            backgroundColor: 'white',
                            borderRadius: 2,
                            padding: "5px"
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'gray',
                            backgroundColor: 'white',
                            borderRadius: 2,
                            padding: "5px",
                        }
                    }}
                />

                {/* Buttons */}
                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Create
                    </Button>
                    <Button
                        type="reset"
                        variant="contained"
                        color="error"
                    >
                        Reset
                    </Button>
                </Stack>
            </Box>


        </>

    )
}

export default FormProduct;