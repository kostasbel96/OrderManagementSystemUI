import PopUpSuccess from "./PopUpSuccess.tsx";
import PopUpDenied from "./PopUpDenied.tsx";
import { motion } from "framer-motion";

interface PopupProps {
    title: string;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    success: boolean;
    popUpMessage: string;
}

const PopUp = ({title, setSubmitted, success, popUpMessage}: PopupProps)=>{
    return (
        <motion.div
            className="backdrop"
            initial={{ y: -80, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -80, opacity: 0, scale: 0.9 }}
            transition={{
                type: "spring",
                stiffness: 500,
                damping: 20,
            }}
        >
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
        </motion.div>
    )
}

export default PopUp;