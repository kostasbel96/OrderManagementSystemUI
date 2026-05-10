import {useState} from "react";
import {z} from "zod";

type FormErrors = {
    name?: string;
    vat?: string;
    phoneNumber1?: string;
    phoneNumber2?: string;
    email?: string;
    message?: string;
    address?: string;
}

const formSchema = z.object(
    {
        name: z.string().trim().nonempty("Name is required"),
        vat:  z.string().regex(/^\d+$/, "Invalid vat number. Only digits are allowed")
            .refine(val => val.replaceAll(/\D/g, '').length >= 9, {
                message: "VAT number must have at least 9 digits",
            }),
        phoneNumber1: z.string().regex(/^\+?\d+$/, "Invalid phone number. Only digits are allowed")
            .refine(val => val.replaceAll(/\D/g, '').length >= 10, {
                message: "Phone number must have at least 10 digits",
            }),
        phoneNumber2: z
            .string()
            .trim()
            .transform(val => val === "" ? undefined : val)
            .optional()
            .refine(val => {
                if (!val) return true;
                return /^\+?\d+$/.test(val) && val.replace(/\D/g, '').length >= 10;
            }, {
                message: "Invalid phone number",
            }),
        email: z.string()
            .trim()
            .optional()
            .refine(
                v => !v || z.email().safeParse(v).success,
                "Email is invalid"
            ),
        address: z.string()
            .trim()
            .optional()
    }
)

export type SupplierFormValues = z.infer<typeof formSchema>;

const useSupplierFormValidation = (values: SupplierFormValues) => {
    const [supplierErrors, setSupplierErrors] = useState<FormErrors>({});

    const validateSupplierForm = () => {
        const result = formSchema.safeParse(values);

        if (!result.success) {
            const newErrors: FormErrors = {};
            result.error.issues.forEach(error => {
                const fieldName = error.path[0] as keyof SupplierFormValues;
                newErrors[fieldName] = error.message;
            });
            setSupplierErrors(newErrors);
            return false;
        }
        setSupplierErrors({});
        return true;
    }

    return {
        validateSupplierForm,
        supplierErrors,
        setSupplierErrors
    }
}

export default useSupplierFormValidation;