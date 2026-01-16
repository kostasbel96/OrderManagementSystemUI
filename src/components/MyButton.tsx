import {useButtonClicked} from "../hooks/useButtonClicked.ts";
import { Button } from "@mui/material";




interface ButtonProps {
    value: string;
    submitted: boolean;
    activeValue: string | null;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setActiveValue: React.Dispatch<React.SetStateAction<string | null>>;
    open: boolean;
}

const MyButton = ({ value, submitted, activeValue, setOpen, setActiveValue, open }: ButtonProps) => {
    const { buttonClick } = useButtonClicked({ value, activeValue, setOpen, setActiveValue });
    const isDisabled = submitted || (open && activeValue !== value);

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={() => {
                if (!isDisabled) buttonClick();
            }}
            disabled={isDisabled}
            sx={{
                textTransform: "none",
                borderRadius: 2,
                py: 1,
                px: 2,
                fontSize: "0.875rem",
                mr: 2
            }}
        >
            {value}
        </Button>
    );
};

export default MyButton;