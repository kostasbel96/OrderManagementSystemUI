import {type GridColDef} from '@mui/x-data-grid';
import {useEffect, useMemo, useState} from "react";
import type {Customer, OrderRow, Product} from "../../types/Types.ts";
import MyTable from "../ui/MyTable.tsx";
import {getProducts} from "../../services/productService.ts";

const ProductsView = () => {
    const [rows, setRows] = useState<(Product | Customer | OrderRow)[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);




    const columns = useMemo<GridColDef[]>(() => [
        { field: 'id', headerName: 'ID', width: 120 },
        { field: 'name', headerName: 'Product name', width: 300 },
        { field: 'description', headerName: 'Description', width: 300 },
        {field: 'quantity', headerName: 'Quantity', width: 80}
    ], []);

    useEffect(() => {
        getProducts(page, pageSize)
            .then((data) => {
                setLoading(true);
                setRows(data.content);
                setRowCount(data.totalElements);
            })
            .finally(() => setLoading(false));
    }, [page, pageSize]);

    return (
            <MyTable
                columns={columns}
                typeOf={"Products"}
                setRows={setRows}
                rows={rows}
                loading={loading}
                setPage={setPage}
                rowCount={rowCount}
                setPageSize={setPageSize}
                page={page}
                pageSize={pageSize}
            ></MyTable>
    )

}

export default ProductsView;