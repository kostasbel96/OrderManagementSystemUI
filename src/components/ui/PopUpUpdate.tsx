import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import type {Product} from "../../types/Types.ts";
import {useEffect, useState} from "react";

interface PopUpUpdateProps{
    open: boolean;
    handleClose: () => void;
    rowToEdit: Product | undefined;
    typeOf: string;
}

const PopUpUpdate = ({open, handleClose, rowToEdit, typeOf}: PopUpUpdateProps) => {
    const [values, setValues] = useState<Product>({
        id: -1,
        name: "",
        description: "",
        quantity: 0,
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(rowToEdit);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setValues(prev => ({
            ...prev,
            [name]: name === "quantity" ? Number(value) : value,
        }));
    }

    useEffect(() => {
        if (typeOf === "Products" && rowToEdit){
            setValues(rowToEdit)
        }
    }, [rowToEdit, typeOf]);

    return (
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Update the product details below.</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Make sure all information is correct before saving your changes.
                    </DialogContentText>
                    <form
                        onSubmit={(event) => handleSubmit(event)}
                        id="subscription-form">
                        <TextField
                            onChange={handleChange}
                            InputProps={{ readOnly: true }}
                            margin="dense"
                            id="id"
                            name="id"
                            type="text"
                            label="Product ID"
                            fullWidth
                            variant="standard"
                            value={values.id}
                        />
                        <TextField
                            onChange={handleChange}
                            value={values.name}
                            margin="dense"
                            id="name"
                            name="name"
                            label="Product Name"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            onChange={handleChange}
                            value={values.description}
                            margin="dense"
                            id="description"
                            name="description"
                            label="Product Description"
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            onChange={handleChange}
                            value={values.quantity}
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
        );

}

export default PopUpUpdate;