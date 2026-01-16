import {Button, Form} from "react-bootstrap";
import {type FormEvent, useState} from "react";
import {addProduct} from "../services/productService.ts";

interface FormProductProps {
    value: string;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormProduct = ({value, setSubmitted}: FormProductProps) => {
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
    }

    const handleOnReset = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProductQuantity(1);
        setProductName("");
        setProductDescription("");
    }

    return (
        <>
            <Form
                className="p-5"
                onSubmit={(e)=>handleOnSubmit(e)}
                onReset={(e)=>handleOnReset(e)}
            >
                <Form.Group className="mb-3 flex justify-end " controlId="exampleForm.ControlInput1">
                    <Form.Label className="p-2">{value.split(" ")[1]}:</Form.Label><br/>
                    <Form.Control
                        type="text"
                        value={productName}
                        placeholder={value.split(" ")[1]}
                        className="p-2 bg-white text-black focus:outline-none"
                        onChange={(e) => setProductName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3 flex justify-end" controlId="exampleForm.ControlTextarea1">
                    <Form.Label className="p-2">Description:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Description"
                        value={productDescription}
                        className="p-2 bg-white text-black focus:outline-none"
                        onChange={(e) => setProductDescription(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3 flex justify-end" controlId="exampleForm.ControlTextarea1">
                    <Form.Label className="p-2">Quantity:</Form.Label>
                    <Form.Control
                        type="number"
                        min={1}
                        value={productQuantity}
                        placeholder="Quantity in stock"
                        className="p-2 bg-white text-black focus:outline-none"
                        onChange={(e) => setProductQuantity(Number(e.target.value))}
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

export default FormProduct;