import {type GridColDef} from '@mui/x-data-grid';
import {useEffect, useMemo, useState} from "react";
import type {Customer, OrderRow, Product} from "../../types/Types.ts";
import MyTable from "../ui/MyTable.tsx";
import {getProducts} from "../../services/productService.ts";
import IconButton from "@mui/material/IconButton";
import {EditIcon} from "lucide-react";
import PopUpUpdate from "../ui/PopUpUpdate.tsx";

const ProductsView = () => {
    const [rows, setRows] = useState<(Product | Customer | OrderRow)[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [rowToEdit, setRowToEdit] = useState<Product>();

    const handleClickOpen = (row: Product) => {
        setOpenEdit(true);
        setRowToEdit(row);
    };

    const handleClose = () => {
        setOpenEdit(false);
    };

    const columns = useMemo<GridColDef[]>(() => [
        { field: 'id', headerName: 'ID', width: 120, renderCell: (params) => (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',   // vertical centering
                        justifyContent: 'start', // horizontal centering
                        whiteSpace: 'pre-line',
                        height: '100%',          // σημαντικό για να γεμίζει το cell
                        width: '100%',
                        marginBottom: '24px'
                    }}
                >
                    {params.value}
                </div>
            ) },
        { field: 'name', headerName: 'Product name', width: 300, renderCell: (params) => (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',   // vertical centering
                        justifyContent: 'start', // horizontal centering
                        whiteSpace: 'pre-line',
                        height: '100%',          // σημαντικό για να γεμίζει το cell
                        width: '100%',
                        marginBottom: '24px'
                    }}
                >
                    {params.value}
                </div>
            )  },
        { field: 'description', headerName: 'Description', width: 300, renderCell: (params) => (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',   // vertical centering
                        justifyContent: 'start', // horizontal centering
                        whiteSpace: 'pre-line',
                        height: '100%',          // σημαντικό για να γεμίζει το cell
                        width: '100%',
                        marginBottom: '24px'
                    }}
                >
                    {params.value}
                </div>
            )  },
        {field: 'quantity', headerName: 'Quantity', width: 80, renderCell: (params) => (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',   // vertical centering
                        justifyContent: 'start', // horizontal centering
                        whiteSpace: 'pre-line',
                        height: '100%',          // σημαντικό για να γεμίζει το cell
                        width: '100%',
                        marginBottom: '24px'
                    }}
                >
                    {params.value}
                </div>
            ) },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton
                    color="primary"
                    onClick={(event) => {
                        event.stopPropagation();
                        handleClickOpen(params.row);
                    }}
                >
                    <EditIcon />
                </IconButton>
            ),
        },
    ], []);

    useEffect(() => {
        getProducts(page, pageSize)
            .then((data) => {
                setLoading(true);
                setRows(data.content);
                setRowCount(data.totalElements);
                setPage(data.pageNumber);
                setPageSize(data.pageSize);
            })
            .finally(() => setLoading(false));
    }, [page, pageSize]);

    return (
        <>
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
            <PopUpUpdate
                open={openEdit}
                handleClose={handleClose}
                rowToEdit={rowToEdit}
                typeOf={"Products"}
                setOpen={setOpenEdit}
            />
        </>

    )

}

export default ProductsView;