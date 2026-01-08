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
    const isDisabled = open && activeValue !== value;

    const buttonClass = `
                text-white text-sm font-bold py-2 px-4 rounded-full transition-colors
                ${isDisabled ? "bg-gray-400 cursor-not-allowed" : ""}
                ${!isDisabled && open && activeValue === value ? "bg-red-600 hover:bg-red-800 hover:cursor-pointer" : ""}
                ${!isDisabled && open && activeValue !== value ? "bg-blue-500 hover:bg-blue-700 hover:cursor-pointer" : ""}
                ${!isDisabled && !open ? "bg-blue-500 hover:bg-blue-700 hover:cursor-pointer" : ""}
            `;

    return (
        <button
            className={buttonClass}
            type="button"
            onClick={buttonClick}
            disabled={open && activeValue !== value}
        >
            {value}
        </button>
    );
};

export default Button;