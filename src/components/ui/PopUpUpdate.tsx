import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, MenuItem,
    TextField,
    Typography
} from "@mui/material";
import type {
    Customer,
    Driver,
    OrderItem,
    OrderRow,
    Product,
    Route,
    RouteDetails,
    SelectedProduct
} from "../../types/Types.ts";
import {useEffect, useState} from "react";
import {updateProduct} from "../../services/productService.ts";
import useProductFormValidation from "../../hooks/useProductFormValidation.ts";
import useCustomerFormValidation from "../../hooks/useCustomerFormValidation.ts";
import useOrderFormValidation from "../../hooks/useOrderFormValidation.ts";
import {updateCustomer} from "../../services/customerService.ts";
import {updateOrder} from "../../services/orderService.ts";
import ProductsTableInsert from "../orders/FormOrder/ProductsTableInsert.tsx";
import useDriverFormValidation from "../../hooks/useDriverFormValidation.ts";
import {updateDriver} from "../../services/driverService.ts";
import useRouteInsertValidation from "../../hooks/useRouteInsertValidation.ts";
import {updateRoute} from "../../services/routeService.ts";
import {RouteStatus} from "../../types/enums/RouteStatus.ts";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers";
import dayjs, {type Dayjs} from "dayjs";

interface PopUpUpdateProps{
    open: boolean;
    rowToEdit: Product | Customer | OrderItem | Driver | Route | undefined ;
    typeOf: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    handleUpdate: (updated: OrderRow | Product | Customer | Driver | Route) => void;
}

const PopUpUpdate = ({open, rowToEdit, typeOf, setOpen, setSubmitted, handleUpdate}: PopUpUpdateProps) => {
    const [productValues, setProductValues] = useState<Product>({
        id: -1,
        name: "",
        description: "",
        quantity: 0,
        price: 0
    });
    const [customerValues, setCustomerValues] = useState<Customer>({
        id: -1,
        name: "",
        lastName: "",
        phoneNumber1: "",
        phoneNumber2: "",
        email: "",
        balance: 0
    });
    const [driverValues, setDriverValues] = useState<Driver>({
        id: -1,
        name: "",
        lastName: "",
        phoneNumber1: "",
        phoneNumber2: ""
    })
    const [orderValues, setOrderValues] = useState<OrderItem>({
        id: -1,
        address: "",
        date: "",
        customer: undefined,
        items: [],
    })
    const [routeValues, setRouteValues] = useState<Route>({
        id: -1,
        name: "",
        date: "",
        orders: [],
        driver: null,
        notes: "",
        status: ""
    })
    const [selectedProductsWithQty, setSelectedProductsWithQty] = useState<SelectedProduct[]>([]);
    const [initialItems, setInitialItems] = useState<SelectedProduct[]>([]);
    const {validateProductForm, productErrors, setProductErrors} = useProductFormValidation(productValues);
    const {validateCustomerForm, customerErrors, setCustomerErrors} = useCustomerFormValidation(customerValues);
    const {validateDriverForm, driverErrors, setDriverErrors} = useDriverFormValidation(driverValues);
    const {validateOrderForm, orderErrors, setOrderErrors} = useOrderFormValidation({
        selectedProductsWithQty: selectedProductsWithQty,
        selectedCustomer: orderValues.customer as Customer,
        address: orderValues.address,
        initialItems
    });
    const {validateRouteInsert, routeErrors, setRouteErrors} = useRouteInsertValidation({
            stops: routeValues.orders.map(order => ({
                id: order.id,
                customer: order.customer,
                products: order.items,
                address: order.address,
                total: order.total ? Number(order.total) : 0,
                date: order.date ? new Date(order.date) : undefined
            } as OrderRow)),
        driver: routeValues.driver as Driver,
        routeName: routeValues.name
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        switch (typeOf) {
            case "Products":
                if (validateProductForm()){
                    updateProduct(productValues)
                        .then(data=>{
                            handleUpdate(data.productDto);
                            setSubmitted(true);})
                        .catch(err=>console.log(err))
                        .finally(()=>setOpen(false));
                }
                break;
            case "Customers":
                if (validateCustomerForm()){
                    updateCustomer(customerValues)
                        .then(data => {
                            handleUpdate(data.customer);
                            setSubmitted(true);
                        })
                        .catch(err=>console.log(err))
                        .finally(()=>setOpen(false));
                }
                break;
            case "Orders":
                if (validateOrderForm()) {
                    updateOrder(orderValues)
                        .then(data => {
                            handleUpdate({
                            id: data.orderItem.id,
                            customer: data.orderItem.customer,
                            products: data.orderItem.items,
                            address: data.orderItem.address,
                            total: Number(data.orderItem.total ?? 0),
                            date: data.orderItem.date ? new Date(data.orderItem.date) : undefined
                            });
                            setSubmitted(true);})
                        .catch(err => console.log(err))
                        .finally(() => setOpen(false));
                }
                break;
            case "Drivers":
                if (validateDriverForm()){
                    updateDriver(driverValues)
                        .then(data => {
                            handleUpdate(data.driver);
                            setSubmitted(true);
                        })
                        .catch(err=>console.log(err))
                        .finally(()=>setOpen(false));
                }
                break;
            case "Routes":
                if (validateRouteInsert()){
                    updateRoute(routeValues)
                        .then(data => {
                            handleUpdate({
                                id: data.route.id,
                                name: data.route.name,
                                date: data.route.date ? dayjs(data.route.date).toDate() : undefined,
                                orders: data.route.orders,
                                driver: data.route.driver,
                                notes: data.route.notes,
                                status: data.route.status
                            });
                            setSubmitted(true);
                        })
                        .catch(err=>console.log(err))
                        .finally(()=>setOpen(false));
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
            case "Drivers":
                setDriverErrors({});
                break;
            case "Routes":
                setRouteErrors({});
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
                    [name]: value,
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
            case "Drivers":
                setDriverValues(prev => ({
                    ...prev,
                    [name]: value,
                }));
                break;
            case "Routes":
                setRouteValues(prev => ({
                    ...prev,
                    [name]: value,
                }));
                break;
            default:
                break;
        }

    }

    const handleDateChange = (
        value: Dayjs | null,
        element: keyof RouteDetails
    ) => {
        setRouteValues((prev) => ({
            ...prev,
            [element]: value,
        }));
    };

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
                <TextField
                    onChange={handleChange}
                    value={productValues.price}
                    margin="dense"
                    id="price"
                    name="price"
                    label="Product price"
                    type="number"
                    fullWidth
                    inputProps={{ min: 0, step: "0.01"}}
                    variant="standard"
                    error={Boolean(productErrors?.price)}
                    helperText={productErrors?.price}
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

    const renderDriverFields = () => {
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
                    value={driverValues.id}
                />
                <TextField
                    onChange={handleChange}
                    value={driverValues.name}
                    margin="dense"
                    id="name"
                    name="name"
                    label="Customer Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    error={Boolean(driverErrors?.name)}
                    helperText={driverErrors?.name}
                />
                <TextField
                    onChange={handleChange}
                    value={driverValues.lastName}
                    margin="dense"
                    id="lastName"
                    name="lastName"
                    label="Customer lastname"
                    type="text"
                    fullWidth
                    variant="standard"
                    error={Boolean(driverErrors?.lastName)}
                    helperText={driverErrors?.lastName}
                />
                <TextField
                    onChange={handleChange}
                    value={driverValues.phoneNumber1}
                    margin="dense"
                    id="phoneNumber1"
                    name="phoneNumber1"
                    label="Phone Number 1"
                    type="text"
                    fullWidth
                    variant="standard"
                    error={Boolean(driverErrors?.phoneNumber1)}
                    helperText={driverErrors?.phoneNumber1}
                />
                <TextField
                    onChange={handleChange}
                    value={driverValues.phoneNumber2}
                    margin="dense"
                    id="phoneNumber2"
                    name="phoneNumber2"
                    label="Phone Number 2"
                    type="text"
                    fullWidth
                    variant="standard"
                    error={Boolean(driverErrors?.phoneNumber2)}
                    helperText={driverErrors?.phoneNumber2}
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
                    <ProductsTableInsert
                        selectedProductsWithQty={selectedProductsWithQty}
                        setSelectedProductsWithQty={setSelectedProductsWithQty}
                    />
                    {orderErrors && (
                        <Typography color="error" fontSize={12}>
                            {orderErrors.products || orderErrors.productQuantity
                                || orderErrors.productPrice || orderErrors.stockError}
                        </Typography>
                    )}
                </div>

            </>
        )
    }

    const renderRouteFields = () => {
        return (
            <>
                <TextField
                    onChange={handleChange}
                    InputProps={{ readOnly: true }}
                    margin="dense"
                    id="id"
                    name="id"
                    type="text"
                    label="Route ID"
                    fullWidth
                    variant="standard"
                    value={routeValues.id}
                />
                <TextField
                    InputProps={{ readOnly: true }}
                    onChange={handleChange}
                    value={routeValues.driver?.name}
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
                    onChange={handleChange}
                    value={routeValues.driver?.lastName}
                    margin="dense"
                    id="lastName"
                    name="lastName"
                    label="Driver lastname"
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    select
                    onChange={handleChange}
                    value={routeValues.status}
                    margin="dense"
                    id="status"
                    name="status"
                    label="Status"
                    fullWidth
                    variant="standard"
                >
                    {Object.values(RouteStatus).map((status) => (
                        <MenuItem key={status} value={status}>
                            {status}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    onChange={handleChange}
                    value={routeValues.notes}
                    margin="dense"
                    id="notes"
                    name="notes"
                    label="Notes"
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <Box className="mt-2">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={dayjs(routeValues.date)}
                            label={"Date"}
                            onChange={(value) => handleDateChange(value, "date")}
                            format="DD/MM/YYYY"
                            slotProps={{
                                textField: {
                                    size: "small",
                                    fullWidth: true,
                                },
                            }}
                        />
                    </LocalizationProvider>
                </Box>

                <TextField
                    onChange={handleChange}
                    value={routeValues.orders.length}
                    margin="dense"
                    id="stops"
                    name="stops"
                    label="Orders"
                    type="text"
                    fullWidth
                    variant="standard"
                    InputProps={{ readOnly: true }}
                />
                <TextField
                    onChange={handleChange}
                    value={routeValues.name}
                    margin="dense"
                    id="name"
                    name="name"
                    label="Route Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    error={Boolean(routeErrors?.routeName)}
                    helperText={routeErrors?.routeName}
                />
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
                
                // Deep copy initial items so they don't change when selectedProductsWithQty changes
                setInitialItems(order.items.map(item => ({...item})));
                
                // Shallow copy is enough here since we want to edit these
                setSelectedProductsWithQty([...order.items]);

                break;
            }
            case "Drivers":
                setDriverValues(rowToEdit as Driver);
                break;
            case "Routes":
                setRouteValues(rowToEdit as Route);
                break;
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
                        {typeOf === "Drivers" ? renderDriverFields() : null}
                        {typeOf === "Routes" ? renderRouteFields() : null}
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