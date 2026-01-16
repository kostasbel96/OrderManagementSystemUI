import { Box, TextField, Button, Stack } from "@mui/material"
import {type FormEvent, useState} from "react";
import {addCustomer} from "../../services/customerService.ts";

interface FormCustomerProps {
    value: string;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormCustomer = ({value, setSubmitted, setSuccess}: FormCustomerProps) => {
    const [customerName, setCustomerName] = useState("");
    const [customerLastName, setCustomerLastName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addCustomer(
            {
                id: -1,
                name: customerName,
                lastName: customerLastName,
                phoneNumber: customerPhone,
                email: customerEmail
            }
        );
        setCustomerName("");
        setCustomerLastName("");
        setCustomerEmail("");
        setCustomerPhone("");
        setSubmitted(true);
        setSuccess(true);
    }

    const handleOnReset = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCustomerName("");
        setCustomerLastName("");
        setCustomerEmail("");
        setCustomerPhone("");
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
                    placeholder={value.split(" ")[1]}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
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

                {/* Last Name */}
                <TextField
                    label="Last Name"
                    placeholder="Last Name"
                    value={customerLastName}
                    onChange={(e) => setCustomerLastName(e.target.value)}
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

                {/* Phone */}
                <TextField
                    label="Phone"
                    type="tel"
                    inputProps={{ pattern: "^69[0-9]{8}$", minLength: 10, maxLength: 10 }}
                    placeholder="Phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
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

                {/* Email */}
                <TextField
                    label="Email"
                    type="email"
                    placeholder="example@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
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