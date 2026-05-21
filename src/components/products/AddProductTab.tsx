import FormTab from "../ui/FormTab.tsx";
import FormProduct from "./FormProduct/FormProduct.tsx";

export default function AddProductTab() {

    return (
        <FormTab tab={"product"}>
            {(props) => <FormProduct {...props} />}
        </FormTab>
    );
}