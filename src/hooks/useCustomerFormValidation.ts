import {useState} from "react";
import {z} from "zod";

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
        name: z.string().trim().nonempty("Name is required"),
        lastName: z.string().trim().nonempty("Last Name is required"),
        phoneNumber1: z.string().regex(/^\+?\d+$/, "Invalid phone number. Only digits are allowed")
            .refine(val => val.replaceAll(/\D/g, '').length >= 10, {
                message: "Phone number must have at least 10 digits",
            }),
        phoneNumber2: z.string().optional().nullable(),
        email: z.string()
            .trim()
            .optional()
            .refine(
                v => !v || z.email().safeParse(v).success,
                "Email is invalid"
            ),
    }
)

export type FormValues = z.infer<typeof formSchema>;

const useCustomerFormValidation = (values: FormValues) => {
    const [customerErrors, setCustomerErrors] = useState<FormErrors>({});

    const validateCustomerForm = () => {
        const result = formSchema.safeParse(values);

        if (!result.success) {
            const newErrors: FormErrors = {};
            result.error.issues.forEach(error => {
                const fieldName = error.path[0] as keyof FormValues;
                newErrors[fieldName] = error.message;
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