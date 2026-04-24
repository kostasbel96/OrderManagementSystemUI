import {useState} from "react";
import PopUp from "./popup/PopUp.tsx";
import MyTabs from "./MyTabs.tsx";

const QuickAdd = () => {
    const [activeValue, setActiveValue] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [success, setSuccess] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState("");


    return (
            <div className="mt-2 text-center">
                <div className="flex justify-center relative">
                    <MyTabs
                        setSubmitted={setSubmitted}
                        setSuccess={setSuccess}
                        setPopUpMessage={setPopUpMessage}
                        setActiveValue={setActiveValue}
                    />
                </div>

                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out
                                ${submitted ? "max-h-40 opacity-300 mt-3" : "max-h-0 opacity-0 mt-0"}`}
                >
                    {
                        submitted && (
                            <PopUp
                                popUpMessage={popUpMessage}
                                title={activeValue ?? ""}
                                setSubmitted={setSubmitted}
                                success={success}
                            />
                        )
                    }
                </div>

            </div>
    );
};

export default QuickAdd;