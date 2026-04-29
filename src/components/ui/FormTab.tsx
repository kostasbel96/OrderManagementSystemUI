import PopUp from "./popup/PopUp.tsx";
import {useState} from "react";

interface FormTabProps {
    children: (props: {
        setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
        setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
        setPopUpMessage: React.Dispatch<React.SetStateAction<string>>;
    }) => React.ReactNode;
    tab: string;
}

export default function FormTab({
                                    children, tab
                                }: Readonly<FormTabProps>) {
    const [submitted, setSubmitted] = useState(false);
    const [success, setSuccess] = useState(true);
    const [popUpMessage, setPopUpMessage] = useState("");

    return (
        <>
            {children({setSubmitted, setSuccess, setPopUpMessage})}
            {submitted &&
                <PopUp
                    title={tab}
                    success={success}
                    popUpMessage={popUpMessage}
                    setSubmitted={setSubmitted}
                />
            }
        </>
    );
}