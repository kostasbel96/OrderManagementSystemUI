import {useState} from "react";
import {z} from "zod";
import {useTranslation} from "react-i18next";

type FormErrors = {
    name?: string;
    vatNumber?: string;
    phoneNumber1?: string;
    phoneNumber2?: string;
    email?: string;
    message?: string;
    address?: string;
}

const formSchema = z.object({
    name: z.string().trim().nonempty("validation.nameRequired"),

    vatNumber: z.string()
        .regex(/^\d+$/, "validation.vatInvalid")
        .refine(val => val.replaceAll(/\D/g, '').length >= 9, {
            message: "validation.vatMinDigits",
        }),

    phoneNumber1: z.string()
        .regex(/^\+?\d+$/, "validation.invalidPhone")
        .refine(val => val.replaceAll(/\D/g, '').length >= 10, {
            message: "validation.phoneMinDigits",
        }),

    phoneNumber2: z.string()
        .trim()
        .transform(val => val === "" ? undefined : val)
        .optional()
        .refine(val => {
            if (!val) return true;
            return /^\+?\d+$/.test(val) && val.replace(/\D/g, '').length >= 10;
        }, {
            message: "validation.invalidPhone",
        }),

    email: z.string()
        .trim()
        .optional()
        .refine(
            v => !v || z.email().safeParse(v).success,
            "validation.emailInvalid"
        ),

    address: z.string().trim().optional()
});

export type SupplierFormValues = z.infer<typeof formSchema>;

const useSupplierFormValidation = (values: SupplierFormValues) => {
    const [supplierErrors, setSupplierErrors] = useState<FormErrors>({});
    const { t } = useTranslation();

    const validateSupplierForm = () => {
        const result = formSchema.safeParse(values);

        if (!result.success) {
            const newErrors: FormErrors = {};

            result.error.issues.forEach(error => {
                const fieldName = error.path[0] as keyof SupplierFormValues;
                newErrors[fieldName] = t(error.message);
            });

            setSupplierErrors(newErrors);
            return false;
        }

        setSupplierErrors({});
        return true;
    };

    return {
        validateSupplierForm,
        supplierErrors,
        setSupplierErrors
    };
};

export default useSupplierFormValidation;