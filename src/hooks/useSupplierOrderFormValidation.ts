import {z} from "zod";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import type {SelectedProduct, Supplier} from '../types/Types.ts';

export const productSchema = z.object({
    id: z.number(),
    name: z.string(),
    quantity: z.number()
});

export const selectedProductSchema = z.object({
    product: productSchema.nullable().refine(val => val !== null, {
        message: "validation.productRequired"
    }),
    quantity: z.coerce.number().min(1, "validation.quantityMin"),
    price: z.coerce.number().min(0, "validation.priceMin")
});

export const orderSupplierSchema = z.object({
    supplier: z
        .object({
            id: z.number(),
            name: z.string(),
        })
        .nullable()
        .refine(val => val !== null, {
            message: "validation.supplierRequired",
        }),

    products: z
        .array(selectedProductSchema)
        .min(1, "validation.minProducts"),
});

interface FormErrors {
    products?: string;
    supplier?: string;
    productPrice?: string;
    productQuantity?: string;
}

type UseOrderFormValidationProps = {
    selectedProductsWithQty: SelectedProduct[];
    selectedSupplier: Supplier | null;
    initialItems?: SelectedProduct[];
}

const useSupplierOrderFormValidation = ({
                                            selectedProductsWithQty,
                                            selectedSupplier,
                                            initialItems
                                        }: UseOrderFormValidationProps) => {

    const [orderSupplierErrors, setOrderSupplierErrors] = useState<FormErrors>({});
    const { t } = useTranslation();

    const validateOrderForm = (): boolean => {

        const result = orderSupplierSchema.safeParse({
            supplier: selectedSupplier,
            products: selectedProductsWithQty,
        });

        const newErrors: FormErrors = {};

        if (!result.success) {

            result.error.issues.forEach(error => {

                if (error.path[0] === "products") {
                    const field = error.path[2];

                    if (field === "quantity") {
                        newErrors.productQuantity = t(error.message);
                    }

                    if (field === "price") {
                        newErrors.productPrice = t(error.message);
                    }

                } else {
                    const fieldName = error.path[0] as keyof FormErrors;
                    newErrors[fieldName] = t(error.message);
                }
            });

            const hasEmptyProduct =
                (initialItems ?? selectedProductsWithQty)
                    .some(p => !p.product);

            if (hasEmptyProduct) {
                setOrderSupplierErrors(prev => ({
                    ...prev,
                    products: t("validation.emptyProductRow")
                }));
            }

            if (selectedProductsWithQty.length === 0) {
                setOrderSupplierErrors(prev => ({
                    ...prev,
                    products: t("validation.minProducts")
                }));
            }

            setOrderSupplierErrors(prev => ({
                ...prev,
                ...newErrors
            }));

            return false;
        }

        setOrderSupplierErrors({});
        return true;
    };

    return {
        validateOrderForm,
        orderSupplierErrors,
        setOrderSupplierErrors
    };
};

export default useSupplierOrderFormValidation;