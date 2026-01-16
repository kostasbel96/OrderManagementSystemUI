import {XIcon} from "lucide-react";
import {Alert} from "react-bootstrap";

interface PopUpDeniedProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
}

const PopUpDenied = ({setSubmitted, title}: PopUpDeniedProps)=>{
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
                className="text-white bg-red-600 flex rounded"
            >
                <Alert.Heading className="p-2">{`${popUpTitle} can not added!`}</Alert.Heading>
                <button>
                    <XIcon
                        size={24}
                        className="mr-1 bg-gray-400 hover:bg-gray-500 rounded"
                        onClick={()=>setSubmitted(false)}
                    ></XIcon>
                </button>
            </Alert>
        </>
    )
}

export default PopUpDenied;