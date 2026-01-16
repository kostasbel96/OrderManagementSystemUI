import {Alert} from "react-bootstrap";
import {Check} from "lucide-react";

interface FormPopUpProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
}



const PopUpSuccess = ({setSubmitted, title}: FormPopUpProps) => {
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
                className="text-white bg-gray-600 flex rounded"
            >
                <Alert.Heading className="p-2">{`${popUpTitle} added successfully!`}</Alert.Heading>
                <button>
                    <Check
                        size={24}
                        className="mr-1 text-blue-900 bg-gray-400 hover:bg-gray-800 rounded"
                        onClick={()=>setSubmitted(false)}
                    ></Check>
                </button>
            </Alert>
        </>
    )
}

export default PopUpSuccess;