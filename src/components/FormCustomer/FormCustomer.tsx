import {Button, Form} from "react-bootstrap";
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
            <Form
                className="p-5"
                onSubmit={(e) => {handleOnSubmit(e)}}
                onReset={(e) => {handleOnReset(e)}}
            >
                <Form.Group className="mb-3 flex justify-end" controlId="exampleForm.ControlInput1">
                    <Form.Label className="p-2">Name:</Form.Label><br/>
                    <Form.Control
                        value={customerName}
                        type="text"
                        placeholder={value.split(" ")[1]}
                        className="p-2 bg-white text-black focus:outline-none"
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3 flex justify-end" controlId="exampleForm.ControlInput1">
                    <Form.Label className="p-2">Last name:</Form.Label><br/>
                    <Form.Control
                        value={customerLastName}
                        type="text"
                        placeholder="Last Name"
                        className="p-2 bg-white text-black focus:outline-none"
                        onChange={(e) => setCustomerLastName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3 flex justify-end" controlId="exampleForm.ControlTextarea1">
                    <Form.Label className="p-2">Phone:</Form.Label>
                    <Form.Control
                        value={customerPhone}
                        pattern="^69[0-9]{8}$"
                        type="tel"
                        placeholder="phone"
                        minLength={10}
                        maxLength={10}
                        className="p-2 bg-white text-black focus:outline-none"
                        onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3 flex justify-end" controlId="exampleForm.ControlTextarea1">
                    <Form.Label className="p-2">Email:</Form.Label>
                    <Form.Control
                        value={customerEmail}
                        type="email"
                        placeholder="example@example.com"
                        className="p-2 bg-white text-black focus:outline-none"
                        onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                </Form.Group>
                <div className="space-x-2 text-center ml-16">
                    <Button
                        className="text-black text-xs font-bold py-2 px-4 rounded-full bg-white hover:bg-gray-300 hover:cursor-pointer"
                        type="submit"
                    >
                        Create
                    </Button>
                    <Button
                        className="text-black text-xs font-bold py-2 px-4 rounded-full bg-white hover:bg-gray-300 hover:cursor-pointer"
                        type="reset"
                    >
                        Reset
                    </Button>
                </div>
            </Form>
        </>
    )
}

export default FormCustomer;