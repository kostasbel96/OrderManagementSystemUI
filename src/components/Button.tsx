import {useButtonClicked} from "../hooks/useButtonClicked.ts";




interface ButtonProps {
    value: string;
    submitted: boolean;
    activeValue: string | null;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setActiveValue: React.Dispatch<React.SetStateAction<string | null>>;
    open: boolean;
}

const Button = ({ value, submitted, activeValue, setOpen, setActiveValue, open }: ButtonProps) => {
    const { buttonClick } = useButtonClicked({ value, activeValue, setOpen, setActiveValue });
    const isDisabled = submitted || (open && activeValue !== value);

    const buttonClass = `
    text-white text-sm font-bold py-2 px-4 rounded-full transition-colors mx-1
    ${isDisabled
        ? "bg-gray-400 cursor-not-allowed"
        : open && activeValue === value
            ? "bg-red-600 hover:bg-red-800 cursor-pointer"
            : "bg-blue-500 hover:bg-blue-700 cursor-pointer"
    }
  `;


    return (
        <button
            className={buttonClass}
            type="button"
            onClick={() => {
                if (!isDisabled) buttonClick(); // ← Αν submitted, δεν καλεί τη λειτουργία
            }}
            disabled={isDisabled}
        >
            {value}
        </button>
    );
};

export default Button;