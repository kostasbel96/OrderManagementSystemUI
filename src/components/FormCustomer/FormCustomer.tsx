import { Box, TextField, Button, Stack } from "@mui/material"
import {type FormEvent, useState} from "react";
import {addCustomer} from "../../services/customerService.ts";
import {z} from "zod";

interface FormCustomerProps {
    value: string;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const formSchema = z.object(
    {
        name: z.string().trim().nonempty("Name is required"),
        lastName: z.string().trim().nonempty("Last Name is required"),
        phone1: z.string().regex(/^\+?\d+$/, "Invalid phone number. Only digits are allowed")
            .refine(val => val.replaceAll(/\D/g, '').length >= 10, {
                message: "Phone number must have at least 10 digits",
            }),
        phone2: z.string().optional().nullable(),
        email: z.string()
            .trim()
            .optional()
            .refine(
                v => !v || z.email().safeParse(v).success,
                "Email is invalid"
            ),
    }
)

type FormValues = z.infer<typeof formSchema>;

const initialValues = {
    name: "",
    lastName: "",
    phone1: "",
    phone2: "",
    email: ""
}

type FormErrors = {
    name?: string;
    lastName?: string;
    phone1?: string;
    phone2?: string;
    email?: string;
    message?: string;
}

const FormCustomer = ({value, setSubmitted, setSuccess}: FormCustomerProps) => {
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
            addCustomer({
                name: values.name,
                lastName: values.lastName,
                phoneNumber1: values.phone1,
                phoneNumber2: values.phone2,
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
        setErrors({});
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const {name, value} = e.target;
        setValues(prev=> ({
            ...prev,
            [name]: value
        }));
        setErrors(prev=>({
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
                    error={Boolean(errors?.name)}
                    helperText={errors?.name}
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
                    error={Boolean(errors?.lastName)}
                    helperText={errors?.lastName}
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
                    name="phone1"
                    placeholder="Phone 1"
                    value={values.phone1}
                    onChange={handleChange}
                    variant="outlined"
                    error={Boolean(errors?.phone1)}
                    helperText={errors?.phone1}
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
                    name="phone2"
                    placeholder="Phone 2"
                    value={values.phone2}
                    onChange={handleChange}
                    variant="outlined"
                    error={Boolean(errors?.phone2)}
                    helperText={errors?.phone2}
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
                    error={Boolean(errors?.email)}
                    helperText={errors?.email}
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