import PopUpSuccess from "./PopUpSuccess.tsx";
import PopUpDenied from "./PopUpDenied.tsx";

interface PopupProps {
    title: string;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    success: boolean;
    popUpMessage: string;
}

const PopUp = ({title, setSubmitted, success, popUpMessage}: PopupProps)=>{
    return (
        <>
            {success ? (
                <PopUpSuccess
                    title={title}
                    setSubmitted={setSubmitted}
                />
            ) : (
                <PopUpDenied
                    popUpMessage={popUpMessage}
                    title={title}
                    setSubmitted={setSubmitted}
                />
            )}
        </>
    )
}

export default PopUp;