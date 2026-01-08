import { Collapse } from "react-collapse";

interface OpenProps {
    isOpen: boolean;
    value: string;
}

const MyCollapse = ({isOpen, value}: OpenProps) => {
    return (
        <>
            <Collapse isOpened={isOpen}>
                <div className="bg-black text-white p-5">{value}</div>
            </Collapse>
        </>
    )
}

export default MyCollapse;