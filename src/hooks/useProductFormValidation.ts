import {z} from "zod";
import {useState} from "react";
import {useTranslation} from "react-i18next";

const formSchema = z.object({
    name: z.string().trim().nonempty("validation.productNameRequired"),
    description: z.string().trim().nonempty("validation.descriptionRequired"),
    quantity: z.coerce.number().min(1, "validation.quantityMin"),
    price: z.coerce.number().min(0, "validation.priceMin")
});

export type FormValues = z.infer<typeof formSchema>;

type FormErrors = {
    name?: string;
    description?: string;
    quantity?: string;
    price?: string;
}

const useProductFormValidation = (values: FormValues) => {
    const [productErrors, setProductErrors] = useState<FormErrors>({});
    const { t } = useTranslation();

    const validateProductForm = () => {
        const result = formSchema.safeParse(values);

        if (!result.success) {
            const newErrors: FormErrors = {};

            result.error.issues.forEach(error => {
                const fieldName = error.path[0] as keyof FormValues;
                newErrors[fieldName] = t(error.message);
            });

            setProductErrors(newErrors);
            return false;
        }

        setProductErrors({});
        return true;
    };

    return {
        validateProductForm,
        productErrors,
        setProductErrors
    };
};

export default useProductFormValidation;