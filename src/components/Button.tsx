import {useButtonClicked} from "../hooks/useButtonClicked.ts";




interface ButtonProps {
    value: string;
    activeValue: string | null;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setActiveValue: React.Dispatch<React.SetStateAction<string | null>>;
    open: boolean;
}

const Button = ({ value, activeValue, setOpen, setActiveValue, open }: ButtonProps) => {
    const { buttonClick } = useButtonClicked({ value, activeValue, setOpen, setActiveValue });
    let addClass;
    if (open && activeValue === value) addClass = "bg-red-500 hover:bg-red-700"
    return (
        <button
            className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full hover:cursor-pointer " + addClass}
            type="button"
            onClick={buttonClick}
            disabled={open && activeValue !== value}
        >
            {value}
        </button>
    );
};

export default Button;