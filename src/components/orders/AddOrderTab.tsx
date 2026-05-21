import FormTab from "../ui/FormTab.tsx";
import FormOrder from "./FormOrder/FormOrder.tsx";


export default function AddOrderTab() {

    return (
        <FormTab tab={"order"}>
            {(props) => <FormOrder {...props} />}
        </FormTab>
    );
}