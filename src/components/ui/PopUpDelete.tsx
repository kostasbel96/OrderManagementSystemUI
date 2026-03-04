import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import type {Customer, OrderItem, Product} from "../../types/Types.ts";
import {deleteProduct} from "../../services/productService.ts";

interface PopUpDeleteProps{
    open: boolean;
    rowToEdit: Product | Customer | OrderItem | undefined ;
    typeOf: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PopUpDelete = ({open, rowToEdit,
                     typeOf, setOpen}: PopUpDeleteProps) => {

    const handleClose = () => {
        setOpen(false);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(rowToEdit)
        deleteProduct(rowToEdit as Product)
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(()=> setOpen(false));
    }

    const renderProductFields = () => {
        return (
            <>
                <TextField
                    InputProps={{ readOnly: true }}
                    margin="dense"
                    id="id"
                    name="id"
                    type="text"
                    label="Product ID"
                    fullWidth
                    variant="standard"
                    value={rowToEdit?.id}
                />
                <TextField
                    InputProps={{ readOnly: true }}
                    value={(rowToEdit as Product)?.name}
                    margin="dense"
                    id="name"
                    name="name"
                    label="Product Name"
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    InputProps={{ readOnly: true }}
                    value={(rowToEdit as Product)?.description}
                    margin="dense"
                    id="description"
                    name="description"
                    label="Product Description"
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    InputProps={{ readOnly: true }}
                    value={(rowToEdit as Product)?.quantity}
                    margin="dense"
                    id="quantity"
                    name="quantity"
                    label="Product Quantity"
                    type="number"
                    fullWidth
                    variant="standard"
                />
            </>
        )
    }


    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Delete the {`${typeOf}`} details below.</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Make sure all information is correct before saving your changes.
                </DialogContentText>
                <form
                    onSubmit={(event) => handleSubmit(event)}
                    id="subscription-form">
                    {typeOf === "Products" ? renderProductFields() : null}
                    {/*{typeOf === "Customers" ? renderCustomerFields() : null}*/}
                    {/*{typeOf === "Orders" ? renderOrderFields() : null}*/}
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>{
                    handleClose()
                }}
                >
                    Cancel
                </Button>
                <Button type="submit" form="subscription-form">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default PopUpDelete;