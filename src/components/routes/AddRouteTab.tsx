import FormTab from "../ui/FormTab.tsx";
import FormRoute from "./FormRoute.tsx";

export default function AddRouteTab() {

    return (
        <FormTab tab={"Route"}>
            {(props) => <FormRoute {...props}/>}
        </FormTab>
    );
}