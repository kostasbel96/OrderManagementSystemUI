import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";
import { useTranslation } from 'react-i18next';
import type {
    Customer,
    Driver,
    OrderItem,
    PurchaseOrderItem,
    Product,
    Receipt,
    ResponseDTO,
    Route,
    Supplier, Payment
} from "../../types/Types.ts";
import {deleteProduct} from "../../services/productService.ts";
import {deleteCustomer} from "../../services/customerService.ts";
import {deleteOrder} from "../../services/orderService.ts";
import {deleteDriver} from "../../services/driverService.ts";
import {deleteRoute} from "../../services/routeService.ts";
import {deleteReceipt} from "../../services/receiptService.ts";
import {deleteSupplier} from "../../services/supplierService.ts";
import {deletePurchaseOrder} from "../../services/purchaseOrderService.ts";
import {deletePayment} from "../../services/paymentService.ts";

interface PopUpDeleteProps{
    open: boolean;
    rowToEdit: Product | Customer | OrderItem | Driver | Route | Receipt | Supplier | PurchaseOrderItem | Payment | undefined ;
    typeOf: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setRowToEdit: React.Dispatch<React.SetStateAction<Product | Customer | OrderItem | Driver | Route | Receipt | Supplier | PurchaseOrderItem | Payment | undefined>>;
    handleDelete: (id: number) => void;
}

const PopUpDelete = ({open, rowToEdit,
                         typeOf, setOpen, setSubmitted, setRowToEdit, handleDelete}: PopUpDeleteProps) => {
    const { t } = useTranslation();

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
            case "orderCustomer":
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
            case "orderSupplier":
                deletePurchaseOrder(rowToEdit as PurchaseOrderItem)
                    .then((data: ResponseDTO) => {
                        console.log(data);
                        setRowToEdit(data.purchaseOrderItem);
                        handleDelete(data.purchaseOrderItem.id);
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
            case "receipt":
                deleteReceipt((rowToEdit as Receipt).id)
                    .then((data: ResponseDTO) => {
                        console.log(data);
                        setRowToEdit(data.receipt);
                        handleDelete(data.receipt.id);
                        setSubmitted(true);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(()=> setOpen(false));
                break;
            case "payment":
                deletePayment((rowToEdit as Payment).id)
                    .then((data: ResponseDTO) => {
                        console.log(data);
                        setRowToEdit(data.payment);
                        handleDelete(data.payment.id);
                        setSubmitted(true);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(()=> setOpen(false));
                break;
            case "Suppliers":
                deleteSupplier((rowToEdit as Supplier))
                    .then((data: ResponseDTO) => {
                        console.log(data);
                        setRowToEdit(data.supplier);
                        handleDelete(data.supplier.id ?? -1);
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
                    slotProps={{ input: { readOnly: true } }}
                    margin="dense"
                    id="id"
                    name="id"
                    type="text"
                    label={t('popup.labels.productId')}
                    fullWidth
                    variant="standard"
                    value={(rowToEdit as Product)?.id}
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Product)?.name}
                    margin="dense"
                    id="name"
                    name="name"
                    label={t('popup.labels.productName')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Product)?.description}
                    margin="dense"
                    id="description"
                    name="description"
                    label={t('popup.labels.productDescription')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Product)?.quantity}
                    margin="dense"
                    id="quantity"
                    name="quantity"
                    label={t('popup.labels.productQuantity')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Product)?.price}
                    margin="dense"
                    id="price"
                    name="price"
                    label={t('popup.labels.productPrice')}
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
                    slotProps={{ input: { readOnly: true } }}
                    margin="dense"
                    id="id"
                    name="id"
                    type="text"
                    label={t('popup.labels.customerId')}
                    fullWidth
                    variant="standard"
                    value={(rowToEdit as Customer)?.id}
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Customer)?.name}
                    margin="dense"
                    id="name"
                    name="name"
                    label={t('popup.labels.customerName')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Customer)?.lastName}
                    margin="dense"
                    id="lastName"
                    name="lastName"
                    label={t('popup.labels.customerLastName')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Customer)?.phoneNumber1}
                    margin="dense"
                    id="phoneNumber1"
                    name="phoneNumber1"
                    label={t('popup.labels.phoneNumber1')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Customer)?.phoneNumber2}
                    margin="dense"
                    id="phoneNumber2"
                    name="phoneNumber2"
                    label={t('popup.labels.phoneNumber2')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Customer)?.email}
                    margin="dense"
                    id="email"
                    name="email"
                    label={t('popup.labels.email')}
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
                    slotProps={{ input: { readOnly: true } }}
                    margin="dense"
                    id="id"
                    name="id"
                    type="text"
                    label={t('popup.labels.driverId')}
                    fullWidth
                    variant="standard"
                    value={(rowToEdit as Driver)?.id}
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Driver)?.name}
                    margin="dense"
                    id="name"
                    name="name"
                    label={t('popup.labels.driverName')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Driver)?.lastName}
                    margin="dense"
                    id="lastName"
                    name="lastName"
                    label={t('popup.labels.driverLastName')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Driver)?.phoneNumber1}
                    margin="dense"
                    id="phoneNumber1"
                    name="phoneNumber1"
                    label={t('popup.labels.phoneNumber1')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Driver)?.phoneNumber2}
                    margin="dense"
                    id="phoneNumber2"
                    name="phoneNumber2"
                    label={t('popup.labels.phoneNumber2')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
            </>
        )
    }

    const renderCustomerOrderFields = () => {
        return (
            <>
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    margin="dense"
                    id="id"
                    name="id"
                    type="text"
                    label={t('popup.labels.orderId')}
                    fullWidth
                    variant="standard"
                    value={(rowToEdit as OrderItem)?.id}
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={`${(rowToEdit as OrderItem)?.customer?.name} ${(rowToEdit as OrderItem)?.customer?.lastName}`}
                    margin="dense"
                    id="name"
                    name="name"
                    label={t('popup.labels.customerName')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as OrderItem)?.address}
                    margin="dense"
                    id="address"
                    name="address"
                    label={t('popup.labels.address')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
            </>
        )
    }

    const renderSupplierOrderFields = () => {
        return (
            <>
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    margin="dense"
                    id="id"
                    name="id"
                    type="text"
                    label={t('popup.labels.orderId')}
                    fullWidth
                    variant="standard"
                    value={(rowToEdit as PurchaseOrderItem)?.id}
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as PurchaseOrderItem)?.supplier?.name}
                    margin="dense"
                    id="name"
                    name="name"
                    label={t('popup.labels.supplierName')}
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
                    slotProps={{ input: { readOnly: true } }}
                    margin="dense"
                    id="id"
                    name="id"
                    type="text"
                    label={t('popup.labels.routeId')}
                    fullWidth
                    variant="standard"
                    value={(rowToEdit as Route)?.id}
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={`${(rowToEdit as Route)?.driver?.name} ${(rowToEdit as Route)?.driver?.lastName}`}
                    margin="dense"
                    id="driverName"
                    name="driverName"
                    label={t('popup.labels.driverName')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Route)?.name}
                    margin="dense"
                    id="name"
                    name="name"
                    label={t('popup.labels.routeName')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
            </>
        )
    }

    const renderReceiptFields = () => {
        return (
            <>
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    margin="dense"
                    id="id"
                    name="id"
                    type="text"
                    label={t('popup.labels.orderId')}
                    fullWidth
                    variant="standard"
                    value={(rowToEdit as Receipt)?.id}
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={`${(rowToEdit as Receipt)?.customer?.name} ${(rowToEdit as Receipt)?.customer?.lastName}`}
                    margin="dense"
                    id="customerName"
                    name="customerName"
                    label={t('popup.labels.customerName')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Receipt)?.amount}
                    margin="dense"
                    id="amount"
                    name="amount"
                    label={t('form.payment.amount')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Receipt)?.date.toString()}
                    margin="dense"
                    id="date"
                    name="date"
                    label={t('popup.labels.date')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
            </>
        )
    }

    const renderPaymentFields = () => {
        return (
            <>
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    margin="dense"
                    id="id"
                    name="id"
                    type="text"
                    label={t('popup.labels.orderId')}
                    fullWidth
                    variant="standard"
                    value={(rowToEdit as Payment)?.id}
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Payment)?.supplier?.name}
                    margin="dense"
                    id="supplierName"
                    name="supplierName"
                    label={t('popup.labels.supplierName')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Payment)?.amount}
                    margin="dense"
                    id="amount"
                    name="amount"
                    label={t('form.payment.amount')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Payment)?.date.toString()}
                    margin="dense"
                    id="date"
                    name="date"
                    label={t('popup.labels.date')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
            </>
        )
    }

    const renderSupplierFields = () => {
        return (
            <>
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    margin="dense"
                    id="id"
                    name="id"
                    type="text"
                    label={t('popup.labels.supplierId')}
                    fullWidth
                    variant="standard"
                    value={(rowToEdit as Supplier)?.id}
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Supplier)?.name}
                    margin="dense"
                    id="companyName"
                    name="companyName"
                    label={t('popup.labels.supplierName')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Supplier)?.email}
                    margin="dense"
                    id="email"
                    name="email"
                    label={t('popup.labels.email')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Supplier)?.phoneNumber1}
                    margin="dense"
                    id="phoneNumber1"
                    name="phoneNumber1"
                    label={t('popup.labels.phoneNumber1')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Supplier)?.phoneNumber2}
                    margin="dense"
                    id="phoneNumber2"
                    name="phoneNumber2"
                    label={t('popup.labels.phoneNumber2')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Supplier)?.vatNumber}
                    margin="dense"
                    id="vatNumber"
                    name="vatNumber"
                    label={t('popup.labels.vatNumber')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    slotProps={{ input: { readOnly: true } }}
                    value={(rowToEdit as Supplier)?.address}
                    margin="dense"
                    id="address"
                    name="address"
                    label={t('popup.labels.address')}
                    type="text"
                    fullWidth
                    variant="standard"
                />
            </>
        )
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{t('popup.deleteDetails', { typeOf: t(`typeNamesOperation.${typeOf}`) })}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('popup.confirmMessage')}
                </DialogContentText>
                <form
                    onSubmit={(event) => handleSubmit(event)}
                    id="subscription-form">
                    {typeOf === "Products" && renderProductFields()}
                    {typeOf === "Customers" && renderCustomerFields()}
                    {typeOf === "orderCustomer" && renderCustomerOrderFields()}
                    {typeOf === "orderSupplier" && renderSupplierOrderFields()}
                    {typeOf === "Drivers" && renderDriverFields()}
                    {typeOf === "Routes" && renderRouteFields()}
                    {typeOf === "receipt" && renderReceiptFields()}
                    {typeOf === "payment" && renderPaymentFields()}
                    {typeOf === "Suppliers" && renderSupplierFields()}
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>{
                    handleClose()
                }}
                >
                    {t('common.cancel')}
                </Button>
                <Button type="submit" form="subscription-form">
                    {t('common.delete')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default PopUpDelete;