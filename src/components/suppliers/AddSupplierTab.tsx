import FormTab from "../ui/FormTab.tsx";
import FormSupplier from "./FormSupplier/FormSupplier.tsx";

export default function AddSupplierTab() {

    return (
        <FormTab tab={"supplier"}>
            {(props) => <FormSupplier {...props} />}
        </FormTab>
    );
}