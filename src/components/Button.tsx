import {useButtonClicked} from "../hooks/useButtonClicked.ts";




interface ButtonProps {
    value: string;
    activeValue: string | null;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setActiveValue: React.Dispatch<React.SetStateAction<string | null>>;
}

const Button = ({ value, activeValue, setOpen, setActiveValue }: ButtonProps) => {
    const { buttonClick } = useButtonClicked({ value, activeValue, setOpen, setActiveValue });

    return (
        <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            type="button"
            onClick={buttonClick}
        >
            {value}
        </button>
    );
};

export default Button;