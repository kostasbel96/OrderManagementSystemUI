import {useState} from "react";
import {z} from "zod";
import {useTranslation} from "react-i18next";

type FormErrors = {
    name?: string;
    lastName?: string;
    phoneNumber1?: string;
    phoneNumber2?: string;
    email?: string;
    message?: string;
}

const formSchema = z.object(
    {
        name: z.string().trim().nonempty("validation.nameRequired"),
        lastName: z.string().trim().nonempty("validation.lastNameRequired"),
        phoneNumber1: z.string().regex(/^\+?\d+$/, "validation.invalidPhone")
            .refine(val => val.replaceAll(/\D/g, '').length >= 10, {
                message: "validation.phoneMinDigits",
            }),
        phoneNumber2: z
            .string()
            .trim()
            .transform(val => val === "" ? undefined : val)
            .optional()
            .refine(val => {
                if (!val) return true;
                return /^\+?\d+$/.test(val) && val.replaceAll(/\D/g, '').length >= 10;
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
    }
)

export type FormValues = z.infer<typeof formSchema>;

const useCustomerFormValidation = (values: FormValues) => {
    const [customerErrors, setCustomerErrors] = useState<FormErrors>({});
    const { t } = useTranslation();

    const validateCustomerForm = () => {
        const result = formSchema.safeParse(values);

        if (!result.success) {
            const newErrors: FormErrors = {};
            result.error.issues.forEach(error => {
                const fieldName = error.path[0] as keyof FormValues;
                newErrors[fieldName] = t(error.message);
            });
            setCustomerErrors(newErrors);
            return false;
        }
        setCustomerErrors({});
        return true;
    }

    return {
        validateCustomerForm,
        customerErrors,
        setCustomerErrors
    }
}

export default useCustomerFormValidation;