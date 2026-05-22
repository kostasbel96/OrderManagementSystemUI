import {useState} from "react";
import {z} from "zod";
import {useTranslation} from "react-i18next";
import type {Customer, Supplier} from "../types/Types.ts";

type FormErrors = {
    amount?: string;
    person?: string;
}

const formSchema = z.object({
    amount: z.coerce.number().min(1, "validation.amountMin"),
    person: z
        .object({
            id: z.number(),
            name: z.string(),
        })
        .nullable()
        .refine(val => val !== null, {
            message: "validation.personRequired",
        }),
});

type FormValues = {
    amount: string;
    person: Customer | Supplier | null;
}

const useReceiptFormValidation = ({amount, person}: FormValues) => {
    const [receiptErrors, setReceiptErrors] = useState<FormErrors>({});
    const { t } = useTranslation();

    const validateReceiptForm = () => {
        const result = formSchema.safeParse({amount, person});

        if (!result.success) {
            const newErrors: FormErrors = {};

            result.error.issues.forEach(error => {
                const fieldName = error.path[0] as keyof FormValues;
                newErrors[fieldName] = t(error.message);
            });

            setReceiptErrors(newErrors);
            return false;
        }

        setReceiptErrors({});
        return true;
    };

    return {
        validateReceiptForm,
        receiptErrors,
        setReceiptErrors
    };
};

export default useReceiptFormValidation;