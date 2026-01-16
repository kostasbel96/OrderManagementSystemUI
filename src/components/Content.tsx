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
            <Button value="Add Order" activeValue={activeValue} setOpen={setOpen} setActiveValue={setActiveValue} open={open} />
            <Button value="Add Product" activeValue={activeValue} setOpen={setOpen} setActiveValue={setActiveValue} open={open} />
            <Button value="Add Customer" activeValue={activeValue} setOpen={setOpen} setActiveValue={setActiveValue} open={open} />
            <div className="flex justify-center mt-2">
                <MyCollapse isOpen={open} value={activeValue ?? ""} setSubmitted={setSubmitted}/>
            </div>
            {
                submitted && (
                    <FormPopUp
                        setSubmitted={setSubmitted}
                        title={activeValue ?? ""}
                    />
                )
            }

        </>
    );
};

export default Content;