import FormTab from "../ui/FormTab.tsx";
import FormOrder from "./FormOrder/FormOrder.tsx";


export default function AddOrderTab() {

    return (
        <FormTab tab={"Order"}>
            {(props) => <FormOrder {...props} />}
        </FormTab>
    );
}