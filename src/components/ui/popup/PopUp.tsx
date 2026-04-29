import PopUpSuccess from "./PopUpSuccess.tsx";
import PopUpDenied from "./PopUpDenied.tsx";
import { motion } from "framer-motion";
import {useEffect, useState} from "react";

interface PopupProps {
    title: string;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    success: boolean;
    popUpMessage: string;
}

const PopUp = ({title, setSubmitted, success, popUpMessage}: PopupProps)=>{

    const [progress, setProgress] = useState(100);
    const [isPaused, setIsPaused] = useState(false);
    const duration = 3000;

    useEffect(() => {
        if (isPaused) return;

        const interval = 30;
        const step = 100 / (duration / interval);

        const timer = setInterval(() => {
            setProgress(prev => Math.max(prev - step, 0));
        }, interval);

        return () => clearInterval(timer);
    }, [isPaused, duration]);

    useEffect(() => {
        if (progress === 0) {
            setSubmitted(false);
        }
    }, [progress, setSubmitted]);


    return (
        <motion.div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
                position: "fixed",
                bottom: 20,
                right: 20,
                zIndex: 9999,
            }}
        >
            {success ? (
                <PopUpSuccess
                    title={title}
                    progress={progress}
                    success={success}
                    setSubmitted={setSubmitted}
                />
            ) : (
                <PopUpDenied
                    popUpMessage={popUpMessage}
                    title={title}
                    progress={progress}
                    success={success}
                    setSubmitted={setSubmitted}
                />
            )}
        </motion.div>
    )
}

export default PopUp;