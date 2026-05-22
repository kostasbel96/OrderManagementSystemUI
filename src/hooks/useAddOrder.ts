import type {Customer, SelectedProduct, Supplier} from "../types/Types.ts";
import {addOrder} from "../services/orderService.ts";
import {addPurchaseOrder} from "../services/purchaseOrderService.ts";
import useCustomerOrderFormValidation from "./useCustomerOrderFormValidation.ts";
import useSupplierOrderFormValidation from "./useSupplierOrderFormValidation.ts";
import {useTranslation} from "react-i18next";

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

    const { t } = useTranslation();

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

    const saveOrder = async (typeOf: string): Promise<boolean> => {
        switch (typeOf) {
            case "orderCustomer":
                if (validateOrderForm()) {
                    try {
                        const data = await addOrder({
                            products: items,
                            customer: customer ?? null,
                            address: address ?? ""
                        });
                        setSuccess(true);
                        setSubmitted(true);
                        setPopUpMessage(t("messages.orderAdded"));
                        console.log(data);
                        return true;
                    } catch (error: any) {
                        setPopUpMessage(error.message);
                        setSubmitted(true);
                        setSuccess(false);
                        return false;
                    }
                }
                setSubmitted(true);
                setSuccess(false);
                return false;

            case "orderSupplier":
                if (validateSupplierOrderForm()) {
                    try {
                        const data = await addPurchaseOrder({
                            products: items,
                            supplier: supplier ?? null,
                        });
                        setSuccess(true);
                        setSubmitted(true);
                        setPopUpMessage(t("messages.orderAdded"));
                        console.log(data);
                        return true;
                    } catch (error: any) {
                        setPopUpMessage(error.message);
                        setSubmitted(true);
                        setSuccess(false);
                        return false;
                    }
                }
                setSubmitted(true);
                setSuccess(false);
                return false;

            default:
                return false;
        }
    };

    return { saveOrder,
        customerOrderErrors,
        supplierOrderErrors,
        setCustomerOrderErrors,
        setSupplierOrderErrors };

}

export default useAddOrder;