import { Collapse } from "react-collapse";
import {Form, Button} from "react-bootstrap";


interface OpenProps {
    isOpen: boolean;
    value: string;
}

const MyCollapse = ({isOpen, value}: OpenProps) => {
    return (
        <>
            <Collapse isOpened={isOpen}>
                <div className="bg-blue-700 shadow-lg rounded-lg text-white p-5 w-full text-sm">
                    <Form className="p-5">
                        <Form.Group className="mb-3 flex justify-end" controlId="exampleForm.ControlInput1">
                            <Form.Label className="p-2">{value.split(" ")[1]}:</Form.Label><br/>
                            <Form.Control type="text" placeholder="Enter Product" className="p-2 bg-white text-black" />
                        </Form.Group>
                        <Form.Group className="mb-3 flex justify-end" controlId="exampleForm.ControlTextarea1">
                            <Form.Label className="p-2">Description:</Form.Label>
                            <Form.Control type="text" placeholder="Description" className="p-2 bg-white text-black" />
                        </Form.Group>
                        <Form.Group className="mb-3 flex justify-end" controlId="exampleForm.ControlTextarea1">
                            <Form.Label className="p-2">Quantity:</Form.Label>
                            <Form.Control type="number" min="0" placeholder="quantity in stock" className="p-2 bg-white text-black"/>
                        </Form.Group>
                        <div className="space-x-2 text-center">
                            <Button className="text-white text-xs font-bold py-2 px-4 rounded-full bg-green-600 hover:bg-green-800 hover:cursor-pointer">
                                Create
                            </Button>
                            <Button className="text-white text-xs font-bold py-2 px-4 rounded-full bg-yellow-600 hover:bg-yellow-800 hover:cursor-pointer">
                                Reset
                            </Button>
                        </div>
                    </Form>


                </div>
            </Collapse>
        </>
    )
}

export default MyCollapse;