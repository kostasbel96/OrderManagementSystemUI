import { Collapse } from "react-collapse";

interface OpenProps {
    isOpen: boolean;
    value: string;
}

const MyCollapse = ({isOpen, value}: OpenProps) => {
    return (
        <>
            <Collapse isOpened={isOpen}>
                <div className="bg-black text-center text-white">{value}</div>
            </Collapse>
        </>
    )
}

export default MyCollapse;