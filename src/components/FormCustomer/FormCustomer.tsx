import { Box, TextField, Button, Stack } from "@mui/material"
import {type FormEvent, useState} from "react";
import {addCustomer} from "../../services/customerService.ts";
import useCustomerFormValidation, {type FormValues} from "../../hooks/useCustomerFormValidation.ts";

interface FormCustomerProps {
    value: string;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialValues = {
    name: "",
    lastName: "",
    phoneNumber1: "",
    phoneNumber2: "",
    email: ""
}

const FormCustomer = ({value, setSubmitted, setSuccess}: FormCustomerProps) => {
    const [values, setValues] = useState<FormValues>(initialValues);
    const {validateCustomerForm, customerErrors, setCustomerErrors} = useCustomerFormValidation(values);

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateCustomerForm()) {
            addCustomer({
                name: values.name,
                lastName: values.lastName,
                phoneNumber1: values.phoneNumber1,
                phoneNumber2: values.phoneNumber2,
                email: values.email
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
        } else {
            setSubmitted(true);
            setSuccess(false);
        }

    }

    const handleOnReset = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValues(initialValues);
        setSubmitted(false);
        setCustomerErrors({});
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const {name, value} = e.target;
        setValues(prev=> ({
            ...prev,
            [name]: value
        }));
        setCustomerErrors(prev=>({
            ...prev,
            [name]: ""
        }))
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
                {/* Name */}
                <TextField
                    label="Name"
                    name="name"
                    placeholder={value.split(" ")[1]}
                    value={values.name}
                    onChange={handleChange}
                    variant="outlined"
                    error={Boolean(customerErrors?.name)}
                    helperText={customerErrors?.name}
                    sx={{ width: 300, backgroundColor: "white", borderRadius: 2,
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
                        }}}
                />
                {/* Last Name */}
                <TextField
                    label="Last Name"
                    name="lastName"
                    placeholder="Last Name"
                    value={values.lastName}
                    onChange={handleChange}
                    variant="outlined"
                    error={Boolean(customerErrors?.lastName)}
                    helperText={customerErrors?.lastName}
                    sx={{ width: 300, backgroundColor: "white", borderRadius: 2,
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
                        }}}
                />
                {/* Phone */}
                <TextField
                    label="Phone 1"
                    type="tel"
                    name="phoneNumber1"
                    placeholder="Phone 1"
                    value={values.phoneNumber1}
                    onChange={handleChange}
                    variant="outlined"
                    error={Boolean(customerErrors?.phoneNumber1)}
                    helperText={customerErrors?.phoneNumber1}
                    sx={{ width: 300, backgroundColor: "white", borderRadius: 2 ,
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
                        }}}
                />
                <TextField
                    label="Phone 2"
                    type="tel"
                    name="phoneNumber2"
                    placeholder="Phone 2"
                    value={values.phoneNumber2}
                    onChange={handleChange}
                    variant="outlined"
                    error={Boolean(customerErrors?.phoneNumber2)}
                    helperText={customerErrors?.phoneNumber2}
                    sx={{ width: 300, backgroundColor: "white", borderRadius: 2 ,
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
                        }}}
                />
                {/* Email */}
                <TextField
                    label="Email"
                    type="text"
                    name="email"
                    placeholder="example@example.com"
                    value={values.email}
                    onChange={handleChange}
                    variant="outlined"
                    error={Boolean(customerErrors?.email)}
                    helperText={customerErrors?.email}
                    sx={{ width: 300, backgroundColor: "white", borderRadius: 2,
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
                {/* Buttons πάνω */}
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Button type="submit"
                            variant="contained"
                            color="primary">
                        Create
                    </Button>
                    <Button type="reset"
                            variant="contained"
                            color="error">
                        Reset
                    </Button>
                </Stack>
            </Box>
    )
}

export default FormCustomer;