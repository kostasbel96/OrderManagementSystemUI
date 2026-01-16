import Button from "./Button.tsx";
import MyCollapse from "./MyCollapse.tsx";
import {useState} from "react";
import FormPopUp from "./popup/FormPopUp.tsx";

const Content = () => {
    const [open, setOpen] = useState(false);
    const [activeValue, setActiveValue] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);


    return (
        <>
            <div className="w-full">
                <Button value="Add Order" activeValue={activeValue} submitted={submitted} setOpen={setOpen} setActiveValue={setActiveValue} open={open} />
                <Button value="Add Product" activeValue={activeValue} submitted={submitted} setOpen={setOpen} setActiveValue={setActiveValue} open={open} />
                <Button value="Add Customer" activeValue={activeValue} submitted={submitted} setOpen={setOpen} setActiveValue={setActiveValue} open={open} />
                <div className="flex justify-center mt-2 relative">
                    <MyCollapse isOpen={open} value={activeValue ?? ""} setSubmitted={setSubmitted}/>
                </div>

                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out
                                ${submitted ? "max-h-40 opacity-300 mt-3" : "max-h-0 opacity-0 mt-0"}`}
                >
                    {
                        submitted && (
                            <div className="flex justify-center p-1 shadow-lg">
                                <FormPopUp
                                    setSubmitted={setSubmitted}
                                    title={activeValue ?? ""}
                                />
                            </div>

                        )
                    }
                </div>

            </div>


        </>
    );
};

export default Content;