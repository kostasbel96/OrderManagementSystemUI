import {useState} from "react";
import {z} from "zod";
import type {Customer} from "../types/Types.ts";

type FormErrors = {
    amount?: string;
    customer?: string;
}

const formSchema = z.object(
    {
        amount: z.coerce.number().min(1, "Amount must be at least 1"),
        customer: z
            .object({
                id: z.number(),
                name: z.string(),
            })
            .nullable()
            .refine(val => val !== null, {
                message: "You must select a customer",
            }),
    }
)

type FormValues = {
    amount: string;
    customer: Customer | null;
}

const useCustomerFormValidation = ({amount, customer}: FormValues) => {
    const [receiptErrors, setReceiptErrors] = useState<FormErrors>({});

    const validateReceiptForm = () => {
        const result = formSchema.safeParse({amount, customer});

        if (!result.success) {
            const newErrors: FormErrors = {};
            result.error.issues.forEach(error => {
                const fieldName = error.path[0] as keyof FormValues;
                newErrors[fieldName] = error.message;
            });
            setReceiptErrors(newErrors);
            return false;
        }
        setReceiptErrors({});
        return true;
    }

    return {
        validateReceiptForm,
        receiptErrors,
        setReceiptErrors
    }
}

export default useCustomerFormValidation;