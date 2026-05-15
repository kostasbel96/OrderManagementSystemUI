import type {Customer, SelectedProduct, Supplier} from "../types/Types.ts";
import {addOrder} from "../services/orderService.ts";
import {addPurchaseOrder} from "../services/purchaseOrderService.ts";
import useCustomerOrderFormValidation from "./useCustomerOrderFormValidation.ts";
import useSupplierOrderFormValidation from "./useSupplierOrderFormValidation.ts";

interface UseAddOrderProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    setPopUpMessage: React.Dispatch<React.SetStateAction<string>>;
    items: SelectedProduct[];
    customer?: Customer | null;
    address?: string;
    supplier?: Supplier | null;
}

const useAddOrder = ({
                         address,
                         customer,
                         supplier,
                         items,
                         setSubmitted,
                         setSuccess,
                         setPopUpMessage, }: UseAddOrderProps) => {
    const {
        validateOrderForm,
        orderErrors: customerOrderErrors,
        setOrderErrors: setCustomerOrderErrors
    } = useCustomerOrderFormValidation({
        selectedProductsWithQty: items,
        selectedCustomer: customer ?? null,
        address: address ?? ""
    });

    const {
        validateOrderForm: validateSupplierOrderForm,
        orderSupplierErrors: supplierOrderErrors,
        setOrderSupplierErrors: setSupplierOrderErrors
    } = useSupplierOrderFormValidation({
        selectedProductsWithQty: items,
        selectedSupplier: supplier ?? null,
    });

    const saveOrder = (typeOf: string) => {
        switch (typeOf) {
            case "orderCustomer":
                if (validateOrderForm()) {
                    addOrder({
                        products: items,
                        customer: customer ?? null,
                        address: address ?? ""
                    })
                        .then((data) => {
                            setSuccess(true);
                            setSubmitted(true);
                            setPopUpMessage("Order created successfully");
                            console.log(data);
                        })
                        .catch((error) => {
                            setPopUpMessage(error.message);
                            setSubmitted(true);
                            setSuccess(false);
                        });
                } else {
                    setSubmitted(true);
                    setSuccess(false);
                }
                break;
            case "orderSupplier":
                if (validateSupplierOrderForm()) {
                    addPurchaseOrder({
                        products: items,
                        supplier: supplier ?? null,
                    })
                        .then((data) => {
                            setSuccess(true);
                            setSubmitted(true);
                            setPopUpMessage("Order created successfully");
                            console.log(data);
                        })
                        .catch((error) => {
                            setPopUpMessage(error.message);
                            setSubmitted(true);
                            setSuccess(false);
                        });
                } else {
                    setSubmitted(true);
                    setSuccess(false);
                }
        }
    }

    return { saveOrder,
        customerOrderErrors,
        supplierOrderErrors,
        setCustomerOrderErrors,
        setSupplierOrderErrors };

}

export default useAddOrder;