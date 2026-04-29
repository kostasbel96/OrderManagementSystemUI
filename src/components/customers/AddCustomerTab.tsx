import FormCustomer from "./FormCustomer/FormCustomer.tsx";
import FormTab from "../ui/FormTab.tsx";

export default function AddCustomerTab() {

    return (
        <FormTab tab={"Customer"}>
            {(props) => <FormCustomer {...props} />}
        </FormTab>
    );
}