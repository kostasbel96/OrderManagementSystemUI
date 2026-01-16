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
            <Alert>
                <Alert.Heading>{`${popUpTitle} added succesfully!`}</Alert.Heading>
                <p>test</p>
                <button>
                    <XIcon
                        onClick={()=>setSubmitted(false)}
                    ></XIcon>
                </button>
            </Alert>
        </>
    )
}

export default FormPopUp;