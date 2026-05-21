import FormTab from "../ui/FormTab.tsx";
import FormDriver from "./FormDriver/FormDriver.tsx";

export default function AddDriverTab() {

    return (
        <FormTab tab={"driver"}>
            {(props) => <FormDriver {...props} />}
        </FormTab>
    );
}