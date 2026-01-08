import {Button, Form} from "react-bootstrap";

interface FormProductProps {
    value: string;
}

const FormProduct = ({value}: FormProductProps) => {
    return (
        <>
            <Form className="p-5">
                <Form.Group className="mb-3 flex justify-end" controlId="exampleForm.ControlInput1">
                    <Form.Label className="p-2">{value.split(" ")[1]}:</Form.Label><br/>
                    <Form.Control type="text" placeholder={value.split(" ")[1]}  className="p-2 bg-white text-black" />
                </Form.Group>
                <Form.Group className="mb-3 flex justify-end" controlId="exampleForm.ControlTextarea1">
                    <Form.Label className="p-2">Description:</Form.Label>
                    <Form.Control type="text" placeholder="Description" className="p-2 bg-white text-black" />
                </Form.Group>
                <Form.Group className="mb-3 flex justify-end" controlId="exampleForm.ControlTextarea1">
                    <Form.Label className="p-2">Quantity:</Form.Label>
                    <Form.Control type="number" min="0" placeholder="Quantity in stock" className="p-2 bg-white text-black"/>
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

export default FormProduct;