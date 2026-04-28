import {z} from "zod";
import {useState} from "react";

const formSchema = z.object({
    name: z.string().trim().nonempty("Product Name is required"),
    description: z.string().trim().nonempty("Description is required"),
    quantity: z.number({ error: "Quantity must be a number" }).min(1, "Quantity must be at least 1"),
    price: z.number({ error: "Price must be a number" }).min(0, "Price must be at least 0"),
})

export type FormValues = z.infer<typeof formSchema>;

type FormErrors = {
    name?: string;
    description?: string;
    quantity?: string;
    price?: string;
}

const useProductFormValidation = (values: FormValues) => {
    const [productErrors, setProductErrors] = useState<FormErrors>({});

    const validateProductForm = () => {
        const result = formSchema.safeParse(values);

        if (!result.success) {
            const newErrors: FormErrors = {};
            result.error.issues.forEach(error => {
                const fieldName = error.path[0] as keyof FormValues;
                newErrors[fieldName] = error.message;
            });
            setProductErrors(newErrors);
            return false;
        }
        setProductErrors({});
        return true;
    }

    return {
        validateProductForm,
        productErrors,
        setProductErrors
    }
}

export default useProductFormValidation;