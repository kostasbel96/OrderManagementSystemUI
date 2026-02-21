import {type FormEvent, useState} from "react";
import {addProduct} from "../../services/productService.ts";
import { Box, TextField, Button, Stack } from "@mui/material"
import useProductFormValidation, {type FormValues} from "../../hooks/useProductFormValidation.ts";

interface FormProductProps {
    value: string;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialValues = {
    name: "",
    description: "",
    quantity: 1,
}

const FormProduct = ({value, setSubmitted, setSuccess}: FormProductProps) => {
    const [values, setValues] = useState<FormValues>(initialValues);
    const {validateProductForm, productErrors, setProductErrors} = useProductFormValidation(values);

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateProductForm()) {
            addProduct({
                name: values.name,
                description: values.description,
                quantity: values.quantity
            }).then((data) => {
                setSuccess(true);
                setSubmitted(true);
                    console.log(data);
                })
                .catch(()=>{
                    setSubmitted(true);
                    setSuccess(false);
                })
            setValues(initialValues);


            setProductErrors({});
        } else {
            setSubmitted(true);
            setSuccess(false);
        }

    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const {name, value} = e.target;
        setValues(prev=> ({
            ...prev,
            [name]: name === "quantity" ? Number(value) : value
        }));
        setProductErrors(prev=>({
           ...prev,
            [name]: ""
        }))
    }

    const handleOnReset = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProductErrors({});
        setValues(initialValues);
        setSubmitted(false);
    }

    return (
            <Box
                component="form"
                onSubmit={handleOnSubmit}
                onReset={handleOnReset}
                sx={{
                    p: 5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    width: "100%",
                }}
            >
                {/* Product Name */}
                <TextField
                    label={value.split(" ")[1]}
                    placeholder={value.split(" ")[1]}
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    variant="outlined"
                    error={Boolean(productErrors?.name)}
                    helperText={productErrors?.name}
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
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    variant="outlined"
                    error={Boolean(productErrors?.description)}
                    helperText={productErrors?.description}
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
                    name="quantity"
                    value={values.quantity}
                    onChange={handleChange}
                    variant="outlined"
                    error={Boolean(productErrors?.quantity)}
                    helperText={productErrors?.quantity}
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
    )
}

export default FormProduct;