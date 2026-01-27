import type {GridColDef} from "@mui/x-data-grid";
import MyTable from "../ui/MyTable.tsx";
import {useEffect, useState} from "react";
import type {Customer, OrderRow, Product} from "../../types/Types.ts";
import {getCustomers} from "../../services/customerService.ts";

const CustomersView = () => {

    const [rows, setRows] = useState<(Product | Customer | OrderRow)[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 120 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'lastName', headerName: 'Last Name', width: 150 },
        {field: 'email', headerName: 'Email', width: 150},
        {field: 'phoneNumber1', headerName: 'Phone Number 1', width: 150},
        {field: 'phoneNumber2', headerName: 'Phone Number 2', width: 150}
    ];

    useEffect(() => {
        setLoading(true);
        getCustomers(page, pageSize)
            .then((data) => {
                setRows(data.content);
                setRowCount(data.totalElements);
            })
            .finally(() => setLoading(false));
    }, [page, pageSize]);


    return (
            <MyTable
                columns={columns}
                typeOf={"Customers"}
                setRows={setRows}
                rows={rows}
                loading={loading}
                setPage={setPage}
                rowCount={rowCount}
                setPageSize={setPageSize}
                page={page}
                pageSize={pageSize}
            ></MyTable>
    );

}

export default CustomersView;