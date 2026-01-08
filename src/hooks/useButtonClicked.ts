interface UseButtonClickedProps {
    value: string;
    activeValue: string | null;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setActiveValue: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useButtonClicked = ({ value, activeValue, setOpen, setActiveValue }: UseButtonClickedProps) => {


    const buttonClick = () => {
        console.log(value + " clicked");

        if (activeValue === value) {
            // ίδιο κουμπί → toggle collapse
            setOpen(prev => !prev);
        } else {
            // άλλο κουμπί → ανοίγει και αλλάζει content
            setActiveValue(value);
            setOpen(true);
        }
    };

    return {
        buttonClick
    };
}