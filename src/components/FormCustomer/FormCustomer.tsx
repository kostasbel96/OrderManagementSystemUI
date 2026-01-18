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
            .refine(val => val.replace(/\D/g, '').length >= 10, {
                message: "Phone number must have at least 10 digits",
            }),
        phone2: z.string().optional().nullable(),
        email: z.email("Email is invalid").trim().nonempty("Email is required"),
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
            addCustomer(
                {
                    id: -1,
                    name: values.name,
                    lastName: values.lastName,
                    phoneNumber1: values.phone1,
                    phoneNumber2: values.phone2,
                    email: values.email
                }
            );
            setValues(initialValues);
            setSubmitted(true);
            setSuccess(true);
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
                {/* Name */}
                <TextField
                    label="Name"
                    name="name"
                    placeholder={value.split(" ")[1]}
                    value={values.name}
                    onChange={handleChange}
                    variant="outlined"
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
                {errors && (<p className="text-sm text-red-900">{errors.name}</p>)}

                {/* Last Name */}
                <TextField
                    label="Last Name"
                    name="lastName"
                    placeholder="Last Name"
                    value={values.lastName}
                    onChange={handleChange}
                    variant="outlined"
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
                {errors && (<p className="text-sm text-red-900">{errors.lastName}</p>)}

                {/* Phone */}
                <TextField
                    label="Phone 1"
                    type="tel"
                    name="phone1"
                    placeholder="Phone 1"
                    value={values.phone1}
                    onChange={handleChange}
                    variant="outlined"
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
                {errors && (<p className="text-sm text-red-900">{errors.phone1}</p>)}

                <TextField
                    label="Phone 2"
                    type="tel"
                    name="phone2"
                    placeholder="Phone 2"
                    value={values.phone2}
                    onChange={handleChange}
                    variant="outlined"
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
                {errors && (<p className="text-sm text-red-900">{errors.phone2}</p>)}

                {/* Email */}
                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="example@example.com"
                    value={values.email}
                    onChange={handleChange}
                    variant="outlined"
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
                {errors && (<p className="text-sm text-red-900">{errors.email}</p>)}

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
        </>
    )
}

export default FormCustomer;