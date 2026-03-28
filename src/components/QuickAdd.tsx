import MyButton from "./MyButton.tsx";
import MyCollapse from "./MyCollapse.tsx";
import {useState} from "react";
import PopUp from "./popup/PopUp.tsx";

const QuickAdd = () => {
    const [open, setOpen] = useState(false);
    const [activeValue, setActiveValue] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [success, setSuccess] = useState(false);
    const [popUpMessage, setPopUpMessage] = useState("");


    return (
            <div className="mt-5 text-center">
                <MyButton value="Add Order"
                          activeValue={activeValue}
                          submitted={submitted}
                          setOpen={setOpen}
                          setActiveValue={setActiveValue}
                          open={open} />
                <MyButton value="Add Product"
                          activeValue={activeValue}
                          submitted={submitted}
                          setOpen={setOpen}
                          setActiveValue={setActiveValue}
                          open={open}
                />
                <MyButton value="Add Customer" activeValue={activeValue} submitted={submitted} setOpen={setOpen} setActiveValue={setActiveValue} open={open} />
                <div className="flex justify-center mt-2 relative">
                    <MyCollapse isOpen={open} value={activeValue ?? ""}
                                setSubmitted={setSubmitted}
                                setSuccess={setSuccess}
                                setPopUpMessage={setPopUpMessage}
                    />
                </div>

                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out
                                ${submitted ? "max-h-40 opacity-300 mt-3" : "max-h-0 opacity-0 mt-0"}`}
                >
                    {
                        submitted && (
                            <div className="flex justify-center p-1 shadow-lg">
                                <PopUp
                                    popUpMessage={popUpMessage}
                                    title={activeValue ?? ""}
                                    setSubmitted={setSubmitted}
                                    success={success}
                                />
                            </div>

                        )
                    }
                </div>

            </div>
    );
};

export default QuickAdd;