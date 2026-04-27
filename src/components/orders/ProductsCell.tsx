import type { SelectedProduct } from "../../types/Types.ts";
import { Popover } from "@mui/material";
import { useState } from "react";
import {Eye, EyeOff} from "lucide-react";

interface ProductsCellProps {
    products: SelectedProduct[];
}

const ProductsCell = ({ products }: ProductsCellProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const open = Boolean(anchorEl);

    const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {/* Trigger */}
            <div
                onClick={handleOpen}
                style={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 8px",
                    background: "#f7f7f7",
                    borderRadius: "6px",
                    width: "100%"
                }}
            >
                <span style={{ fontWeight: 500 }}>
                    Products ({products.length})
                </span>
                {open ? <EyeOff size={12}/> : <Eye size={12} color={"#555"} />}
            </div>

            {/* Overlay */}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <div style={{
                    padding: "8px",
                    overflowY: "auto"
                }}>
                    {products.map((item, index) => (
                        <div
                            key={item.product?.id + "-" + index}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr auto",
                                gap: "8px",
                                padding: "6px 4px",
                                borderBottom: "1px solid #eee",
                                fontSize: "0.75rem"
                            }}
                        >
                            <div style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                            }}>
                                {item.product?.name}
                            </div>

                            <div style={{ color: "#555" }}>
                                {item.quantity} x {item.price}€
                            </div>
                        </div>
                    ))}
                </div>
            </Popover>
        </>
    );
};

export default ProductsCell;