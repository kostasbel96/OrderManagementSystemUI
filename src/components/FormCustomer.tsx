import {Button, Form} from "react-bootstrap";

interface FormCustomerProps {
    value: string;
}

const FormCustomer = ({value}: FormCustomerProps) => {
    return (
        <>
            <Form className="p-5">
                <Form.Group className="mb-3 flex justify-end" controlId="exampleForm.ControlInput1">
                    <Form.Label className="p-2">Name:</Form.Label><br/>
                    <Form.Control type="text" placeholder={value.split(" ")[1]}  className="p-2 bg-white text-black" />
                </Form.Group>
                <Form.Group className="mb-3 flex justify-end" controlId="exampleForm.ControlInput1">
                    <Form.Label className="p-2">Last name:</Form.Label><br/>
                    <Form.Control type="text" placeholder={value.split(" ")[1]}  className="p-2 bg-white text-black" />
                </Form.Group>
                <Form.Group className="mb-3 flex justify-end" controlId="exampleForm.ControlTextarea1">
                    <Form.Label className="p-2">Phone:</Form.Label>
                    <Form.Control pattern="^69[0-9]{8}$" type="tel" placeholder="phone" minLength={10} maxLength={10} className="p-2 bg-white text-black" />
                </Form.Group>
                <Form.Group className="mb-3 flex justify-end" controlId="exampleForm.ControlTextarea1">
                    <Form.Label className="p-2">Quantity:</Form.Label>
                    <Form.Control type="email" placeholder="example@example.com" className="p-2 bg-white text-black"/>
                </Form.Group>
                <div className="space-x-2 text-center ml-16">
                    <Button className="text-black text-xs font-bold py-2 px-4 rounded-full bg-white hover:bg-gray-300 hover:cursor-pointer">
                        Create
                    </Button>
                    <Button className="text-black text-xs font-bold py-2 px-4 rounded-full bg-white hover:bg-gray-300 hover:cursor-pointer">
                        Reset
                    </Button>
                </div>
            </Form>
        </>
    )
}

export default FormCustomer;