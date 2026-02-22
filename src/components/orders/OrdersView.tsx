import {useEffect, useState} from "react";
import type {GridColDef} from "@mui/x-data-grid";
import {getOrder, getOrders} from "../../services/orderService.ts"
import MyTable from "../ui/MyTable.tsx";
import type {Customer, OrderItem, OrderRow, Product, SelectedProduct} from "../../types/Types.ts";
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
            setRowToEdit({...data.orderItem});
        }).finally(()=>setOpenEdit(true));

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
        {
            field: 'products',
            headerName: 'Products',
            width: 250,
            renderCell: (params) => (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',   // vertical centering
                    justifyContent: 'start', // horizontal centering
                    whiteSpace: 'pre-line',
                    height: '100%',          // σημαντικό για να γεμίζει το cell
                    width: '100%',
                    marginBottom: '24px'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'start' }}>
                        <tbody>
                        {params.value.map((item: SelectedProduct, index: number) => (
                            <tr key={index} style={{ borderBottom: '1px solid #ccc' }}>
                                <td style={{ padding: '4px 8px' }}>{item.product.name}</td>
                                <td style={{ padding: '4px 8px' }}>{item.quantity}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ),
        },
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
        {field: 'date', headerName: 'Date', width: 100, renderCell: (params) => (
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
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <IconButton
                        color="primary"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleClickOpen(params.row);
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                </div>
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
                        products: order.items,
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
    }, [page, pageSize, openEdit])

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
                setOpen={setOpenEdit}
                rowToEdit={rowToEdit}
                typeOf={"Orders"}
            />
        </>

    )

}

export default OrdersView;