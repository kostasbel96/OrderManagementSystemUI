import {useEffect, useState} from "react";
import type {GridColDef} from "@mui/x-data-grid";
import {getOrder, getOrders} from "../../services/OrderService.ts"
import MyTable from "../ui/MyTable.tsx";
import type {Customer, OrderItem, OrderRow, Product} from "../../types/Types.ts";
import PopUpUpdate from "../ui/PopUpUpdate.tsx";
import IconButton from "@mui/material/IconButton";
import {EditIcon} from "lucide-react";


const OrdersView = () => {

    const [rows, setRows] = useState<(Customer | Product | OrderRow)[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [rowToEdit, setRowToEdit] = useState<Product | Customer | OrderItem>();

    const handleClickOpen = (row: OrderRow) => {
        if (row.id) getOrder(row.id).then(data=> {
            console.log(data.OrderItem);
            setRowToEdit({...data.OrderItem});
        }).finally(()=>setOpenEdit(true));

    };

    const handleClose = () => {
        setOpenEdit(false);
    };

    const columns: GridColDef[] = [
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
        { field: 'customer', headerName: 'Customer', width: 200, renderCell: (params) => (
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
        { field: 'products', headerName: 'Products', width: 200, renderCell: (params) => (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',   // vertical centering
                    justifyContent: 'start', // horizontal centering
                    whiteSpace: 'pre-line',
                    height: '100%',          // σημαντικό για να γεμίζει το cell
                    width: '100%',
                    marginBottom: '24px'
                }}>
                    {params.value}
                </div>
            ) },
        { field: 'quantity', headerName: 'Quantity', width: 150, renderCell: (params) => (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',   // vertical centering
                    justifyContent: 'start', // horizontal centering
                    whiteSpace: 'pre-line',
                    height: '100%',          // σημαντικό για να γεμίζει το cell
                    width: '100%',
                    marginBottom: '24px'
                }}>
                    {params.value}
                </div>
            ) },
        {field: 'address', headerName: 'Address', width: 150, renderCell: (params) => (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',   // vertical centering
                    justifyContent: 'start', // horizontal centering
                    whiteSpace: 'pre-line',
                    height: '100%',          // σημαντικό για να γεμίζει το cell
                    width: '100%',
                    marginBottom: '24px'
                }}>
                    {params.value}
                </div>
            )},
        {field: 'date', headerName: 'Date', width: 150, renderCell: (params) => (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',   // vertical centering
                    justifyContent: 'start', // horizontal centering
                    whiteSpace: 'pre-line',
                    height: '100%',          // σημαντικό για να γεμίζει το cell
                    width: '100%',
                }}>
                    {params.value}
                </div>
            )},
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
    ];

    useEffect(() => {
        getOrders(page, pageSize)
            .then(data => {
                setLoading(true);
                const orders: OrderRow[] = [];
                data.content.forEach(order => {
                    orders.push({
                        id: order.id,
                        customer: `${order.customer?.name} ${order.customer?.lastName}`,
                        products: order.items.map(item => item.product.name).join("\n"),
                        quantity: order.items.map(item => item.quantity).join("\n"),
                        address: order.address,
                        date: order.date
                    });
                });
                setRows(orders);
                setRowCount(data.totalElements);
                setPage(data.pageNumber);
                setPageSize(data.pageSize);
            })
            .catch(() => console.log("error fetching orders"))
            .finally(() => setLoading(false));
    }, [page, pageSize])

    useEffect(() => {
        console.log(rowToEdit);
    }, [rowToEdit]);

    return (
        <>
            <MyTable
                columns={columns}
                typeOf={"Orders"}
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
                typeOf={"Orders"}
            />
        </>

    )

}

export default OrdersView;