import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import type {Customer, OrderItem, Product, ResponseDTO} from "../../types/Types.ts";
import {deleteProduct} from "../../services/productService.ts";
import {deleteCustomer} from "../../services/customerService.ts";
import {deleteOrder} from "../../services/orderService.ts";

interface PopUpDeleteProps{
    open: boolean;
    rowToEdit: Product | Customer | OrderItem | undefined ;
    typeOf: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setRowToEdit: React.Dispatch<React.SetStateAction<Product | Customer | OrderItem | undefined>>;
    handleDelete: (id: number) => void;
}

const PopUpDelete = ({open, rowToEdit,
                     typeOf, setOpen, setSubmitted, setRowToEdit, handleDelete}: PopUpDeleteProps) => {

    const handleClose = () => {
        setOpen(false);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        switch (typeOf) {
            case "Products":
                deleteProduct(rowToEdit as Product)
                    .then((data: ResponseDTO) => {
                        handleDelete(data.productDto.id)
                        setRowToEdit(data.productDto);
                        setSubmitted(true);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(()=> setOpen(false));
                break;
            case "Customers":
                deleteCustomer(rowToEdit as Customer)
                    .then((data: ResponseDTO) => {
                        handleDelete(data.customer.id ?? -1);
                        setRowToEdit(data.customer);
                        setSubmitted(true);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(()=> setOpen(false));
                break;
            case "Orders":
                deleteOrder(rowToEdit as OrderItem)
                    .then((data: ResponseDTO) => {
                        console.log(data);
                        setRowToEdit(data.orderItem);
                        handleDelete(data.orderItem.id);
                        setSubmitted(true);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(()=> setOpen(false));
                break;
        }
        console.log(rowToEdit)

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
                    value={(rowToEdit as Product)?.id}
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
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    InputProps={{ readOnly: true }}
                    value={(rowToEdit as Product)?.price}
                    margin="dense"
                    id="price"
                    name="price"
                    label="Product price"
                    type="text"
                    fullWidth
                    variant="standard"
                />
            </>
        )
    }

    const renderCustomerFields = () => {
        return (
            <>
                <TextField
                    InputProps={{ readOnly: true }}
                    margin="dense"
                    id="id"
                    name="id"
                    type="text"
                    label="Customer ID"
                    fullWidth
                    variant="standard"
                    value={(rowToEdit as Customer)?.id}
                />
                <TextField
                    InputProps={{ readOnly: true }}
                    value={(rowToEdit as Customer)?.name}
                    margin="dense"
                    id="name"
                    name="name"
                    label="Customer Name"
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    InputProps={{ readOnly: true }}
                    value={(rowToEdit as Customer)?.lastName}
                    margin="dense"
                    id="lastName"
                    name="lastName"
                    label="Customer lastname"
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    InputProps={{ readOnly: true }}
                    value={(rowToEdit as Customer)?.phoneNumber1}
                    margin="dense"
                    id="phoneNumber1"
                    name="phoneNumber1"
                    label="Phone Number 1"
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    InputProps={{ readOnly: true }}
                    value={(rowToEdit as Customer)?.phoneNumber2}
                    margin="dense"
                    id="phoneNumber2"
                    name="phoneNumber2"
                    label="Phone Number 2"
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    InputProps={{ readOnly: true }}
                    value={(rowToEdit as Customer)?.email}
                    margin="dense"
                    id="email"
                    name="email"
                    label="Email"
                    type="text"
                    fullWidth
                    variant="standard"
                />
            </>
        )
    }

    const renderOrderFields = () => {
        return (
            <>
                <TextField
                    InputProps={{ readOnly: true }}
                    margin="dense"
                    id="id"
                    name="id"
                    type="text"
                    label="Order ID"
                    fullWidth
                    variant="standard"
                    value={(rowToEdit as OrderItem)?.id}
                />
                <TextField
                    InputProps={{ readOnly: true }}
                    value={`${(rowToEdit as OrderItem)?.customer?.name} ${(rowToEdit as OrderItem)?.customer?.lastName}`}
                    margin="dense"
                    id="name"
                    name="name"
                    label="Customer Name"
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    InputProps={{ readOnly: true }}
                    value={(rowToEdit as OrderItem)?.address}
                    margin="dense"
                    id="address"
                    name="address"
                    label="Address"
                    type="text"
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
                    {typeOf === "Products" && renderProductFields()}
                    {typeOf === "Customers" && renderCustomerFields()}
                    {typeOf === "Orders" && renderOrderFields()}
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