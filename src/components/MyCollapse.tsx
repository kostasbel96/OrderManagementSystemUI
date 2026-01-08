import { Collapse } from "react-collapse";
import FormProduct from "./FormProduct.tsx";
import FormOrder from "./FormOrder.tsx";
import FormCustomer from "./FormCustomer.tsx";


interface OpenProps {
    isOpen: boolean;
    value: string;
}

const MyCollapse = ({isOpen, value}: OpenProps) => {
    return (
        <>
            <Collapse isOpened={isOpen} className="mb-5">
                <div className="bg-blue-700 shadow-lg rounded-lg text-white p-5 w-full text-sm">
                    {value.includes("Product") && (<FormProduct value={value} />)}
                    {value.includes("Order") && (<FormOrder/>)}
                    {value.includes("Customer") && (<FormCustomer value={value} />)}
                </div>
            </Collapse>
        </>
    )
}

export default MyCollapse;