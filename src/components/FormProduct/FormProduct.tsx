import {type FormEvent, useState} from "react";
import {addProduct} from "../../services/productService.ts";
import { Box, TextField, Button, Stack } from "@mui/material"
import {z} from "zod";

interface FormProductProps {
    value: string;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const formSchema = z.object(
    {
        name: z.string().trim().nonempty("Product Name is required"),
        description: z.string().trim().nonempty("Description is required"),
        quantity: z.coerce.number().min(1, "Quantity must be at least 1")
    }
)

type FormValues = z.infer<typeof formSchema>;

type FormErrors = {
    name?: string;
    description?: string;
    quantity?: string;
}

const initialValues = {
    name: "",
    description: "",
    quantity: 1,
}

const FormProduct = ({value, setSubmitted, setSuccess}: FormProductProps) => {
    const [values, setValues] = useState<FormValues>(initialValues);
    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = () => {
        const result = formSchema.safeParse(values);

        if (!result.success) {
            const newErrors: FormErrors = {};
            result.error.issues.forEach(error => {
                const fieldName = error.path[0] as keyof FormValues;
                newErrors[fieldName] = error.message;
            });
            setErrors(newErrors);
            return false;
        }
        setErrors({});
        return true;
    }

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
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


            setErrors({});
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
        setErrors(prev=>({
           ...prev,
            [name]: ""
        }))
    }

    const handleOnReset = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
        setValues(initialValues);
        setSubmitted(false);
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
                    error={Boolean(errors?.name)}
                    helperText={errors?.name}
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
                    error={Boolean(errors?.description)}
                    helperText={errors?.description}
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
                    error={Boolean(errors?.quantity)}
                    helperText={errors?.quantity}
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