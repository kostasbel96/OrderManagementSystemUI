import {z} from "zod";
import {useState} from "react";
import type {SelectedProduct, Customer} from '../types/Types.ts';
import {useTranslation} from "react-i18next";

export const productSchema = z.object({
    id: z.number(),
    name: z.string(),
    quantity: z.number()
});

export const selectedProductSchema = (t: any) => z.object({
    product: productSchema.nullable().refine(val => val !== null, {
        message: t("validation.productRequired")
    }),
    quantity: z.coerce.number().min(1, t("validation.quantityMin")),
    price: z.coerce.number().min(0, t("validation.priceMin"))
});

export const orderSchema = (t: any) => z.object({
    customer: z
        .object({
            id: z.number(),
            name: z.string(),
        })
        .nullable()
        .refine(val => val !== null, {
            message: t("validation.customerRequired"),
        }),

    products: z
        .array(selectedProductSchema(t))
        .min(1, t("validation.emptyProductRow")),

    address: z
        .string()
        .trim()
        .min(2, t("validation.addressRequired"))

})

interface FormErrors {
    products?: string;
    customer?: string;
    address?: string;
    productQuantity?: string;
    productPrice?: string;
    stockError?: string;
}

type UseOrderFormValidationProps = {
    selectedProductsWithQty: SelectedProduct[];
    selectedCustomer: Customer | null;
    address: string;
    initialItems?: SelectedProduct[];
}

const useCustomerOrderFormValidation = ({selectedProductsWithQty, selectedCustomer, address, initialItems}: UseOrderFormValidationProps) => {
    const [orderErrors, setOrderErrors] = useState<FormErrors>({});
    const { t } = useTranslation();

    const validQuantity = (): {notValidProducts: SelectedProduct[], isValid: boolean} => {
        const notValidProducts = selectedProductsWithQty.filter(sp => {
            if (!sp.product){
                return false;
            }
            const original = (initialItems ?? []).find(i => i.product?.id === sp.product?.id);
            const originalQuantity = original ? original.quantity : 0;
            const availableStock = sp.product.quantity + originalQuantity;

            return sp.quantity > availableStock;
        });

        return {
            notValidProducts,
            isValid: notValidProducts.length === 0
        };
    }

    const validateOrderForm = (): boolean => {

        const result = orderSchema(t).safeParse({
            customer: selectedCustomer,
            products: selectedProductsWithQty,
            address: address
        });
        const {notValidProducts, isValid} = validQuantity();
        const productNames = notValidProducts
            .map(sp => `${sp.product?.name}(${sp.product?.quantity})`)
            .join(", ")
            .toUpperCase();

        if (!result.success) {
            const newErrors: FormErrors = {};
            result.error.issues.forEach(error => {
                if (error.path[0] === "products") {
                    const field = error.path[2];

                    if (field === "quantity") {
                        newErrors.productQuantity = error.message;
                    }

                    if (field === "price") {
                        newErrors.productPrice = error.message;
                    }
                } else {
                    const fieldName = error.path[0] as keyof FormErrors;
                    newErrors[fieldName] = error.message;
                }
            });
            selectedProductsWithQty.find(p => p.product === null || p.product === undefined) && setOrderErrors(prevState => ({...prevState, products: "You cannot have empty product row"}))
            if (selectedProductsWithQty.length === 0) setOrderErrors(prevState => ({...prevState, products: t("validation.minProducts")}))
            setOrderErrors(prevState => ({...prevState, ...newErrors}));
            return false;
        }

        if (!isValid) {
            setOrderErrors({
                stockError: t("order.stockError", { products: productNames })
            });
            return false;
        }
        setOrderErrors({})
        return true;
    }

    return {
        validateOrderForm,
        orderErrors,
        setOrderErrors
    }
}

export default useCustomerOrderFormValidation;