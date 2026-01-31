import {useEffect, useState} from "react";
import type {GridColDef} from "@mui/x-data-grid";
import {getOrders} from "../../services/OrderService.ts"
import MyTable from "../ui/MyTable.tsx";
import type {Customer, OrderRow, Product} from "../../types/Types.ts";


const OrdersView = () => {

    const [rows, setRows] = useState<(Customer | Product | OrderRow)[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);

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
        { field: 'products', headerName: 'Products', width: 250, renderCell: (params) => (
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
            )}
    ];

    useEffect(() => {
        setLoading(true);
        getOrders(page, pageSize)
            .then(data => {
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
            })
            .catch(() => console.log("error fetching orders"))
            .finally(() => setLoading(false));
    }, [page, pageSize])

    return (
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
    )

}

export default OrdersView;