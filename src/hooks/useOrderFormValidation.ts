import {z} from "zod";
import {useState} from "react";
import type {SelectedProduct, Customer} from '../types/Types.ts';

const productSchema = z.object({
    id: z.number(),
    name: z.string(),
    quantity: z.number(),
});

const selectedProductSchema = z.object({
    product: productSchema,
    quantity: z
        .number()
        .min(1, "Quantity must be at least 1")
});

const orderSchema = z.object({
    customer: z
        .object({
            id: z.number(),
            name: z.string(),
        })
        .nullable()
        .refine(val => val !== null, {
            message: "You must select a customer",
        }),

    products: z
        .array(selectedProductSchema)
        .min(1, "You must select at least 1 product"),

    address: z
        .string()
        .trim()
        .min(2, "Address is required"),
})

type FormErrors = {
    products?: string;
    customer?: string;
    address?: string;
    quantity?: string;
}

type UseOrderFormValidationProps = {
    selectedProductsWithQty: SelectedProduct[];
    selectedCustomer: Customer | null;
    address: string;
    initialItems?: SelectedProduct[];
}

const useOrderFormValidation = ({selectedProductsWithQty, selectedCustomer, address, initialItems}: UseOrderFormValidationProps) => {
    const [orderErrors, setOrderErrors] = useState<FormErrors>({})

    const validQuantity = (): boolean => {
        const changedProducts = selectedProductsWithQty.filter(sp => {
            const original = (initialItems ?? []).find(i => i.product.id === sp.product.id);
            return !original || original.quantity !== sp.quantity;
        });
        return changedProducts.every(sp => sp.quantity <= sp.product.quantity);
    }

    const validateOrderForm = (): boolean => {

        const result = orderSchema.safeParse({
            customer: selectedCustomer,
            products: selectedProductsWithQty,
            address: address
        });

        if (!result.success) {
            const newErrors: FormErrors = {};
            result.error.issues.forEach(error => {
                const fieldName = error.path[0] as keyof FormErrors;
                newErrors[fieldName] = error.message;
            })
            setOrderErrors(newErrors);
            return false;
        }

        if (!validQuantity()) {
            setOrderErrors({
                quantity: "Quantity in stock is less than you requested."
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

export default useOrderFormValidation;