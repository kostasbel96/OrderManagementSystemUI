import FormTab from "../ui/FormTab.tsx";
import FormReceipt from "./FormReceipt.tsx";

export default function AddReceiptTab() {

    return (
        <FormTab tab={"Receipt"}>
            {(props) => <FormReceipt {...props} />}
        </FormTab>
    );
}