import {type GridColDef} from '@mui/x-data-grid';
import {useState} from "react";
import type {Customer, OrderRow, Product} from "../../types/Types.ts";
import {getProducts} from "../../services/productService.ts";
import {Minus, Plus} from "lucide-react";
import MyTable from "../ui/MyTable.tsx";

const ProductsView = () => {
    const [rows, setRows] = useState<(Product | Customer | OrderRow)[]>(getProducts());

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 120 },
        { field: 'name', headerName: 'Product name', width: 300 },
        { field: 'description', headerName: 'Description', width: 300 },
        {field: 'quantity', headerName: 'Quantity', width: 80},
        {
            field: "action",
            headerName: "Action",
            sortable: false,
            cellClassName: "!outline-none focus:!outline-none focus-within:!outline-none",
            renderCell: (params) => {
                const increaseQuantity = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    setRows(prev =>
                        prev.map(row =>
                            row.id === params.row.id
                                ? { ...row, quantity: params.row.quantity + 1 }
                                : row
                        )
                    );

                };
                const decreaseQuantity = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    setRows(prev =>
                        prev.map(row =>
                            row.id === params.row.id && params.row.quantity > 0
                                ? { ...row, quantity: params.row.quantity - 1 }
                                : row
                        )
                    );

                };

                return (<>
                    <div className="flex items-center justify-center gap-2 h-full">
                        <button
                            className="p-2 rounded hover:bg-gray-400"
                            onClick={increaseQuantity}
                        >
                            <Plus size={12} />
                        </button>
                        <button
                            className="p-2 rounded hover:bg-gray-400"
                            onClick={decreaseQuantity}
                        >
                            <Minus size={12} />
                        </button>
                    </div>

                </>);
            }
        }
    ];



    return (
        <>
            <MyTable
                columns={columns}
                typeOf={"Products"}
                setRows={setRows}
                rows={rows}
            ></MyTable>

        </>
    )

}

export default ProductsView;