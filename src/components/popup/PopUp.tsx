import PopUpSuccess from "./PopUpSuccess.tsx";
import PopUpDenied from "./PopUpDenied.tsx";

interface PopupProps {
    title: string;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    success: boolean;
}

const PopUp = ({title, setSubmitted, success}: PopupProps)=>{
    return (
        <>
            {success ? (
                <PopUpSuccess
                    title={title}
                    setSubmitted={setSubmitted}
                />
            ) : (
                <PopUpDenied
                    title={title}
                    setSubmitted={setSubmitted}
                />
            )}
        </>
    )
}

export default PopUp;