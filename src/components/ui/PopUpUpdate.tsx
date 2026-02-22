import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import type {Customer, OrderItem, Product, SelectedProduct} from "../../types/Types.ts";
import {useEffect, useState} from "react";
import MySelect from "../FormOrder/MySelect.tsx";
import {getProducts, updateProduct} from "../../services/productService.ts";
import useProductFormValidation from "../../hooks/useProductFormValidation.ts";
import useCustomerFormValidation from "../../hooks/useCustomerFormValidation.ts";
import useOrderFormValidation from "../../hooks/useOrderFormValidation.ts";
import {updateCustomer} from "../../services/customerService.ts";
import {updateOrder} from "../../services/orderService.ts";

interface PopUpUpdateProps{
    open: boolean;
    rowToEdit: Product | Customer | OrderItem | undefined ;
    typeOf: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PopUpUpdate = ({open, rowToEdit, typeOf, setOpen}: PopUpUpdateProps) => {
    const [productValues, setProductValues] = useState<Product>({
        id: -1,
        name: "",
        description: "",
        quantity: 0,
    });
    const [customerValues, setCustomerValues] = useState<Customer>({
        id: -1,
        name: "",
        lastName: "",
        phoneNumber1: "",
        phoneNumber2: "",
        email: "",
    })
    const [orderValues, setOrderValues] = useState<OrderItem>({
        id: -1,
        address: "",
        date: "",
        customer: null,
        items: [],
    })
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductsWithQty, setSelectedProductsWithQty] = useState<SelectedProduct[]>([]);
    const [initialItems, setInitialItems] = useState<SelectedProduct[]>([]);
    const {validateProductForm, productErrors, setProductErrors} = useProductFormValidation(productValues);
    const {validateCustomerForm, customerErrors, setCustomerErrors} = useCustomerFormValidation(customerValues);
    const {validateOrderForm, orderErrors, setOrderErrors} = useOrderFormValidation({
        selectedProductsWithQty: selectedProductsWithQty,
        selectedCustomer: orderValues.customer,
        address: orderValues.address,
        initialItems
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(rowToEdit);
        switch (typeOf) {
            case "Products":
                if (validateProductForm()){
                    updateProduct(productValues)
                        .then(data=>console.log(data))
                        .catch(err=>console.log(err))
                        .finally(()=>setOpen(false));
                }
                break;
            case "Customers":
                if (validateCustomerForm()){
                    updateCustomer(customerValues)
                        .then(data => console.log(data))
                        .catch(err=>console.log(err))
                        .finally(()=>setOpen(false));
                }
                break;
            case "Orders":
                if (validateOrderForm()) {
                    updateOrder(orderValues)
                        .then(data => console.log(data))
                        .catch(err => console.log(err))
                        .finally(() => setOpen(false));
                }
                break;

        }
    }

    const handleClose = () => {
        switch (typeOf){
            case "Products":
                setProductErrors({});
                break;
            case "Customers":
                setCustomerErrors({});
                break;
            case "Orders":
                setOrderErrors({});
                break;

        }
        setOpen(false);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        switch (typeOf){
            case "Products":
                setProductValues(prev => ({
                    ...prev,
                    [name]: name === "quantity" ? Number(value) : value,
                }));
                break;
            case "Customers":
                setCustomerValues(prev => ({
                    ...prev,
                    [name]: value,
                }));
                break;
            case "Orders":
                setOrderValues(prev=>({
                    ...prev,
                    [name]: value,
                }))
                break;
            default:
                break;
        }

    }

    const renderProductFields = () => {
        return (
            <>
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
                    value={productValues.id}
                />
                <TextField
                    onChange={handleChange}
                    value={productValues.name}
                    margin="dense"
                    id="name"
                    name="name"
                    label="Product Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    error={Boolean(productErrors?.name)}
                    helperText={productErrors?.name}
                />
                <TextField
                    onChange={handleChange}
                    value={productValues.description}
                    margin="dense"
                    id="description"
                    name="description"
                    label="Product Description"
                    type="text"
                    fullWidth
                    variant="standard"
                    error={Boolean(productErrors?.description)}
                    helperText={productErrors?.description}
                />
                <TextField
                    onChange={handleChange}
                    value={productValues.quantity}
                    margin="dense"
                    id="quantity"
                    name="quantity"
                    label="Product Quantity"
                    type="number"
                    fullWidth
                    variant="standard"
                    error={Boolean(productErrors?.quantity)}
                    helperText={productErrors?.quantity}
                />
            </>
        )
    }

    const renderCustomerFields = () => {
        return (
            <>
                <TextField
                    onChange={handleChange}
                    InputProps={{ readOnly: true }}
                    margin="dense"
                    id="id"
                    name="id"
                    type="text"
                    label="Customer ID"
                    fullWidth
                    variant="standard"
                    value={customerValues.id}
                />
                <TextField
                    onChange={handleChange}
                    value={customerValues.name}
                    margin="dense"
                    id="name"
                    name="name"
                    label="Customer Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    error={Boolean(customerErrors?.name)}
                    helperText={customerErrors?.name}
                />
                <TextField
                    onChange={handleChange}
                    value={customerValues.lastName}
                    margin="dense"
                    id="lastName"
                    name="lastName"
                    label="Customer lastname"
                    type="text"
                    fullWidth
                    variant="standard"
                    error={Boolean(customerErrors?.lastName)}
                    helperText={customerErrors?.lastName}
                />
                <TextField
                    onChange={handleChange}
                    value={customerValues.phoneNumber1}
                    margin="dense"
                    id="phoneNumber1"
                    name="phoneNumber1"
                    label="Phone Number 1"
                    type="text"
                    fullWidth
                    variant="standard"
                    error={Boolean(customerErrors?.phoneNumber1)}
                    helperText={customerErrors?.phoneNumber1}
                />
                <TextField
                    onChange={handleChange}
                    value={customerValues.phoneNumber2}
                    margin="dense"
                    id="phoneNumber2"
                    name="phoneNumber2"
                    label="Phone Number 2"
                    type="text"
                    fullWidth
                    variant="standard"
                    error={Boolean(customerErrors?.phoneNumber2)}
                    helperText={customerErrors?.phoneNumber2}
                />
                <TextField
                    onChange={handleChange}
                    value={customerValues.email}
                    margin="dense"
                    id="email"
                    name="email"
                    label="Email"
                    type="text"
                    fullWidth
                    variant="standard"
                    error={Boolean(customerErrors?.email)}
                    helperText={customerErrors?.email}
                />
            </>
        )
    }

    const renderOrderFields = () => {
        return (
            <>
                <TextField
                    onChange={handleChange}
                    InputProps={{ readOnly: true }}
                    margin="dense"
                    id="id"
                    name="id"
                    type="text"
                    label="Order ID"
                    fullWidth
                    variant="standard"
                    value={orderValues.id}
                />
                <TextField
                    InputProps={{ readOnly: true }}
                    onChange={handleChange}
                    value={orderValues.customer?.name}
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
                    onChange={handleChange}
                    value={orderValues.customer?.lastName}
                    margin="dense"
                    id="lastName"
                    name="lastName"
                    label="Customer lastname"
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    onChange={handleChange}
                    value={orderValues.address}
                    margin="dense"
                    id="address"
                    name="address"
                    label="Address"
                    type="text"
                    fullWidth
                    variant="standard"
                    error={Boolean(orderErrors?.address)}
                    helperText={orderErrors?.address}
                />
                <div className="mt-2">
                    <MySelect
                        myValue="Products"
                        isMultiValue={true}
                        products={products}
                        selectedProductsWithQty={selectedProductsWithQty}
                        setSelectedProductsWithQty={setSelectedProductsWithQty}
                    />
                    {orderErrors && (<p className="text-sm text-red-600">{orderErrors.products || orderErrors.quantity}</p>)}
                </div>

            </>
        )
    }

    useEffect(() => {
        if (!rowToEdit) return;
        switch (typeOf) {
            case "Products":
                setProductValues(rowToEdit as Product);
                break;
            case "Customers":
                setCustomerValues(rowToEdit as Customer);
                break;
            case "Orders":{
                const order = rowToEdit as OrderItem;
                setOrderValues(order);
                setInitialItems([...order.items]);
                getProducts(0, 100)
                    .then(data=>{
                        setProducts(data.content);
                        setSelectedProductsWithQty([
                            ...(rowToEdit as OrderItem).items
                        ]);
                    });

                break;
            }
            default:
                break;
        }
    }, [rowToEdit, typeOf]);

    useEffect(() => {
        setOrderValues(prev => ({
            ...prev,
            items: selectedProductsWithQty
        }));
    }, [selectedProductsWithQty]);

    return (
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Update the {`${typeOf}`} details below.</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Make sure all information is correct before saving your changes.
                    </DialogContentText>
                    <form
                        onSubmit={(event) => handleSubmit(event)}
                        id="subscription-form">
                        {typeOf === "Products" ? renderProductFields() : null}
                        {typeOf === "Customers" ? renderCustomerFields() : null}
                        {typeOf === "Orders" ? renderOrderFields() : null}
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>{
                            setSelectedProductsWithQty([]);
                            handleClose()
                            }
                        }
                    >
                        Cancel</Button>
                    <Button type="submit" form="subscription-form">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        );

}

export default PopUpUpdate;