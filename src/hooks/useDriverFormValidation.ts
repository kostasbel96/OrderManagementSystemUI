import {useState} from "react";
import {z} from "zod";

type FormErrors = {
    name?: string;
    lastName?: string;
    phoneNumber1?: string;
    phoneNumber2?: string;
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
            })
    }
)

export type FormDriverValues = z.infer<typeof formSchema>;

const useDriverFormValidation = (values: FormDriverValues) => {
    const [driverErrors, setDriverErrors] = useState<FormErrors>({});

    const validateDriverForm = () => {
        const result = formSchema.safeParse(values);

        if (!result.success) {
            const newErrors: FormErrors = {};
            result.error.issues.forEach(error => {
                const fieldName = error.path[0] as keyof FormDriverValues;
                newErrors[fieldName] = error.message;
            });
            setDriverErrors(newErrors);
            return false;
        }
        setDriverErrors({});
        return true;
    }

    return {
        validateDriverForm,
        driverErrors,
        setDriverErrors
    }
}

export default useDriverFormValidation;