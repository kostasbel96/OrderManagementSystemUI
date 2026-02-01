import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import type {Product} from "../../types/Types.ts";

interface PopUpUpdateProps{
    open: boolean;
    handleClose: () => void;
    rowToEdit: Product | undefined;
}

const PopUpUpdate = ({open, handleClose, rowToEdit}: PopUpUpdateProps) => {


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(rowToEdit);
    }

    return (
            <>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Subscribe</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To subscribe to this website, please enter your email address here. We
                            will send updates occasionally.
                        </DialogContentText>
                        <form onSubmit={(event) => handleSubmit(event)} id="subscription-form">
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="name"
                                name="name"
                                label="Product Name"
                                type="text"
                                fullWidth
                                variant="standard"
                            />
                            <TextField
                                margin="dense"
                                id="description"
                                name="description"
                                label="Product Description"
                                type="text"
                                fullWidth
                                variant="standard"
                            />
                            <TextField
                                margin="dense"
                                id="quantity"
                                name="quantity"
                                label="Product Quantity"
                                type="number"
                                fullWidth
                                variant="standard"
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" form="subscription-form">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );

}

export default PopUpUpdate;