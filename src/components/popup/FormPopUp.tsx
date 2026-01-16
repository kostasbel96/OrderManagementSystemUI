import {Alert} from "react-bootstrap";
import {XIcon} from "lucide-react";

interface FormPopUpProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
}

const FormPopUp = ({setSubmitted, title}: FormPopUpProps) => {

    return (
        <>
            <Alert>
                <Alert.Heading>{`${title} added succesfully!`}</Alert.Heading>
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

export default FormPopUp;;