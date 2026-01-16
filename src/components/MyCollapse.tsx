import { Collapse } from "react-collapse";
import FormProduct from "./FormProduct.tsx";
import FormOrder from "./FormOrder/FormOrder.tsx";
import FormCustomer from "./FormCustomer.tsx";

interface OpenProps {
    isOpen: boolean;
    value: string;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

const MyCollapse = ({isOpen, value, setSubmitted}: OpenProps) => {

    return (
        <>
            <Collapse isOpened={isOpen}>
                <div className="bg-blue-700 shadow-lg rounded-lg text-white text-sm mb-5">
                    {value.includes("Product") && (<FormProduct value={value} setSubmitted={setSubmitted}/>)}
                    {value.includes("Order") && (<FormOrder/>)}
                    {value.includes("Customer") && (<FormCustomer value={value} />)}
                </div>
            </Collapse>

        </>
    )
}

export default MyCollapse;