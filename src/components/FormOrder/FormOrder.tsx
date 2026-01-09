import {Button, Form} from "react-bootstrap";
import MySelect from "./MySelect.tsx";

const FormOrder = () => {

    return (
        <>
            <Form className="p-5">
                <MySelect myValue="Products" isMultiValue={true}></MySelect>
                <div className="border-b-2 mb-5 mt-5"></div>
                <MySelect myValue="Customers" isMultiValue={false}></MySelect>
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
    );
}

export default FormOrder;