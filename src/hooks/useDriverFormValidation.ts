import {useState} from "react";
import {z} from "zod";
import {useTranslation} from "react-i18next";

type FormErrors = {
    name?: string;
    lastName?: string;
    phoneNumber1?: string;
    phoneNumber2?: string;
    message?: string;
}

const formSchema = z.object({
    name: z.string().trim().nonempty("validation.nameRequired"),
    lastName: z.string().trim().nonempty("validation.lastNameRequired"),

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
            return /^\+?\d+$/.test(val) && val.replaceAll(/\D/g, '').length >= 10;
        }, {
            message: "validation.invalidPhone",
        })
});

export type FormDriverValues = z.infer<typeof formSchema>;

const useDriverFormValidation = (values: FormDriverValues) => {
    const [driverErrors, setDriverErrors] = useState<FormErrors>({});
    const { t } = useTranslation();

    const validateDriverForm = () => {
        const result = formSchema.safeParse(values);

        if (!result.success) {
            const newErrors: FormErrors = {};

            result.error.issues.forEach(error => {
                const fieldName = error.path[0] as keyof FormDriverValues;

                newErrors[fieldName] = t(error.message);
            });

            setDriverErrors(newErrors);
            return false;
        }

        setDriverErrors({});
        return true;
    };

    return {
        validateDriverForm,
        driverErrors,
        setDriverErrors
    };
};

export default useDriverFormValidation;