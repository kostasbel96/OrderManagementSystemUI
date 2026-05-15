import {z} from "zod";
import {useState} from "react";
import type {SelectedProduct, Supplier} from '../types/Types.ts';

export const productSchema = z.object({
    id: z.number(),
    name: z.string(),
    quantity: z.number()
});

export const selectedProductSchema = z.object({
    product: productSchema.nullable().refine(val => val !== null, {
        message: "Product is required"
    }),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    price: z.coerce.number().min(0, "Price must be at least 0")
});

export const orderSupplierSchema = z.object({
    supplier: z
        .object({
            id: z.number(),
            name: z.string(),
        })
        .nullable()
        .refine(val => val !== null, {
            message: "You must select a supplier",
        }),

    products: z
        .array(selectedProductSchema)
        .min(1, "You must select at least 1 product"),

})

interface FormErrors {
    products?: string;
    supplier?: string;
    productPrice?: string;
    productQuantity?: string;
}

type UseOrderFormValidationProps = {
    selectedProductsWithQty: SelectedProduct[];
    selectedSupplier: Supplier | null;
}

const useSupplierOrderFormValidation = ({selectedProductsWithQty, selectedSupplier}: UseOrderFormValidationProps) => {
    const [orderSupplierErrors, setOrderSupplierErrors] = useState<FormErrors>({});

    const validateOrderForm = (): boolean => {

        const result = orderSupplierSchema.safeParse({
            supplier: selectedSupplier,
            products: selectedProductsWithQty,
        });

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
            selectedProductsWithQty.find(p => p.product === null || p.product === undefined) && setOrderSupplierErrors(prevState => ({...prevState, products: "You cannot have empty product row"}))
            if (selectedProductsWithQty.length === 0) setOrderSupplierErrors(prevState => ({...prevState, products: "You must select at least 1 product"}))
            setOrderSupplierErrors(prevState => ({...prevState, ...newErrors}));
            return false;
        }
        setOrderSupplierErrors({})
        return true;
    }

    return {
        validateOrderForm,
        orderSupplierErrors,
        setOrderSupplierErrors
    }
}

export default useSupplierOrderFormValidation;