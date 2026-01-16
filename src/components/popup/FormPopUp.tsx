import {Alert} from "react-bootstrap";
import {XIcon} from "lucide-react";

interface FormPopUpProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
}



const FormPopUp = ({setSubmitted, title}: FormPopUpProps) => {
    let popUpTitle;

    if (title.includes("Product")){
        popUpTitle = "Product"
    } else if (title.includes("Customer")){
        popUpTitle = "Customer"
    } else {
        popUpTitle = "Order"
    }

    return (
        <>
            <Alert
                className="text-white bg-green-600 p-2 flex rounded transform-content"
            >
                <Alert.Heading>{`${popUpTitle} added successfully!`}</Alert.Heading>
                <button>
                    <XIcon
                        size={16}
                        className="mb-5 ml-2 border hover:bg-red-500 rounded"
                        onClick={()=>setSubmitted(false)}
                    ></XIcon>
                </button>
            </Alert>
        </>
    )
}

export default FormPopUp;