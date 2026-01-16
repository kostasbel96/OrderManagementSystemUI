import { Collapse } from "react-collapse";
import FormProduct from "./FormProduct/FormProduct.tsx";
import FormOrder from "./FormOrder/FormOrder.tsx";
import FormCustomer from "./FormCustomer/FormCustomer.tsx";

interface OpenProps {
    isOpen: boolean;
    value: string;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const MyCollapse = ({isOpen, value, setSubmitted, setSuccess}: OpenProps) => {

    return (
        <>
            <Collapse isOpened={isOpen}>
                <div className="bg-blue-700 shadow-lg rounded-lg text-white text-sm mb-5">
                    {value.includes("Product") && (<FormProduct value={value} setSubmitted={setSubmitted}
                                                            setSuccess={setSuccess}
                    />)}
                    {value.includes("Order") && (<FormOrder setSubmitted={setSubmitted}
                                                            setSuccess={setSuccess}
                    />)}
                    {value.includes("Customer") && (<FormCustomer value={value} setSubmitted={setSubmitted}
                                                            setSuccess={setSuccess}
                    />)}
                </div>
            </Collapse>

        </>
    )
}

export default MyCollapse;