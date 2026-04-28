import {Box, type SxProps} from "@mui/material";
import type {Theme} from "@mui/material/styles";

const labelSx: SxProps<Theme> = {
    width: "fit-content",
    padding: "6px",
    border: "1px solid #bdbdbd",
    borderRadius: "8px 0px 0px 8px",
    height: "100%",
    fontSize: 12,
    textAlign: "right",
    bgcolor: "#f5f5f5",
    whiteSpace: "nowrap",
    minHeight: 32
};

interface OMSLabelProps {
    label: string;
    required?: boolean;
    labelSxOverride?: SxProps<Theme>;
}

const OMSLabel = ({label, required = false, labelSxOverride} : Readonly<OMSLabelProps>) =>{

    return (
        <Box sx={{ ...labelSx as object, ...labelSxOverride as object } as SxProps<Theme>}>
            {label}
            {required && <span style={{ color: "#d32f2f", marginLeft: 4 }}>*</span>}
        </Box>
    );
}


export default OMSLabel;