import {z} from "zod";
import {useState} from "react";

const formSchema = z.object(
    {
        name: z.string().trim().nonempty("Product Name is required"),
        description: z.string().trim().nonempty("Description is required"),
        quantity: z.coerce.number().min(1, "Quantity must be at least 1")
    }
)

export type FormValues = z.infer<typeof formSchema>;

type FormErrors = {
    name?: string;
    description?: string;
    quantity?: string;
}




const useProductFormValidation = (values: FormValues) => {
    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = () => {
        const result = formSchema.safeParse(values);

        if (!result.success) {
            const newErrors: FormErrors = {};
            result.error.issues.forEach(error => {
                const fieldName = error.path[0] as keyof FormValues;
                newErrors[fieldName] = error.message;
            });
            setErrors(newErrors);
            return false;
        }
        setErrors({});
        return true;
    }

    return {
        validateForm,
        errors,
        setErrors
    }
}

export default useProductFormValidation;