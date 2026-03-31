import type {SelectedProduct} from "../../types/Types.ts";
import {Collapse} from "@mui/material";

interface ProductsCellProps{
    products: SelectedProduct[];
    open: boolean;
    onToggle: () => void;
}

const ProductsCell = ({products, open, onToggle}: ProductsCellProps) => {

    return (
        <div style={{ width: "100%", fontSize: "13px" }}>
            <div
                onClick={(e) => { e.stopPropagation(); onToggle(); }}
                style={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 8px",
                    background: "#f7f7f7",
                    borderRadius: "6px"
                }}
            >
                <span style={{ fontWeight: 500 }}>Products ({products.length})</span>
                <span style={{ fontSize: "12px" }}>{open ? "▲" : "▼"}</span>
            </div>

            <Collapse in={open}>
                <div style={{ marginTop: "6px" }}>
                    {products.map((item, index) => (
                        <div
                            key={item.product.id + "-" + index}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr auto auto",
                                gap: "8px",
                                padding: "6px 8px",
                                borderBottom: "1px solid #eee",
                                alignItems: "center"
                            }}
                        >
                            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {item.product.name}
                            </div>
                            <div style={{ textAlign: "center", color: "#555" }}>{item.quantity} pcs</div>
                            <div style={{ textAlign: "right", fontWeight: 500 }}>{item.price} €</div>
                        </div>
                    ))}
                </div>
            </Collapse>
        </div>
    );
}

export default ProductsCell;