import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import type {Customer, Driver, OrderItem, Product, ResponseDTO, Route} from "../../types/Types.ts";
import {deleteProduct} from "../../services/productService.ts";
import {deleteCustomer} from "../../services/customerService.ts";
import {deleteOrder} from "../../services/orderService.ts";
import {deleteDriver} from "../../services/driverService.ts";
import {deleteRoute} from "../../services/routeService.ts";

interface PopUpDeleteProps{
    open: boolean;
    rowToEdit: Product | Customer | OrderItem | Driver | Route | undefined ;
    typeOf: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setRowToEdit: React.Dispatch<React.SetStateAction<Product | Customer | OrderItem | Driver | Route | undefined>>;
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
            case "Drivers":
                deleteDriver(rowToEdit as Driver)
                    .then((data: ResponseDTO) => {
                        handleDelete(data.driver.id ?? -1);
                        setRowToEdit(data.driver);
                        setSubmitted(true);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(()=> setOpen(false));
                break;
            case "Routes":
                deleteRoute(rowToEdit as Route)
                    .then((data: ResponseDTO) => {
                        console.log(data);
                        setRowToEdit(data.route);
                        handleDelete(data.route.id);
                        setSubmitted(true);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(()=> setOpen(false));
                break;
        }

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

    const renderDriverFields = () => {
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
                    value={(rowToEdit as Driver)?.id}
                />
                <TextField
                    InputProps={{ readOnly: true }}
                    value={(rowToEdit as Driver)?.name}
                    margin="dense"
                    id="name"
                    name="name"
                    label="Driver Name"
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    InputProps={{ readOnly: true }}
                    value={(rowToEdit as Driver)?.lastName}
                    margin="dense"
                    id="lastName"
                    name="lastName"
                    label="Driver lastname"
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    InputProps={{ readOnly: true }}
                    value={(rowToEdit as Driver)?.phoneNumber1}
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
                    value={(rowToEdit as Driver)?.phoneNumber2}
                    margin="dense"
                    id="phoneNumber2"
                    name="phoneNumber2"
                    label="Phone Number 2"
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

    const renderRouteFields = () => {
        return (
            <>
                <TextField
                    InputProps={{ readOnly: true }}
                    margin="dense"
                    id="id"
                    name="id"
                    type="text"
                    label="Route ID"
                    fullWidth
                    variant="standard"
                    value={(rowToEdit as Route)?.id}
                />
                <TextField
                    InputProps={{ readOnly: true }}
                    value={`${(rowToEdit as Route)?.driver?.name} ${(rowToEdit as Route)?.driver?.lastName}`}
                    margin="dense"
                    id="name"
                    name="name"
                    label="Driver Name"
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    InputProps={{ readOnly: true }}
                    value={(rowToEdit as Route)?.name}
                    margin="dense"
                    id="name"
                    name="name"
                    label="Name"
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
                    {typeOf === "Drivers" && renderDriverFields()}
                    {typeOf === "Routes" && renderRouteFields()}
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