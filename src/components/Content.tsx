import Button from "./Button.tsx";
import MyCollapse from "./MyCollapse.tsx";
import {useState} from "react";


const Content = () => {
    const [open, setOpen] = useState(false);
    const [activeValue, setActiveValue] = useState<string | null>(null);

    return (
        <>
            <Button value="Add Order" activeValue={activeValue} setOpen={setOpen} setActiveValue={setActiveValue} />
            <Button value="Add Product" activeValue={activeValue} setOpen={setOpen} setActiveValue={setActiveValue} />
            <Button value="Add Customer" activeValue={activeValue} setOpen={setOpen} setActiveValue={setActiveValue} />
            <div className="mt-3">
                <MyCollapse isOpen={open} value={activeValue ?? ""} />
            </div>
        </>
    );
};

export default Content;