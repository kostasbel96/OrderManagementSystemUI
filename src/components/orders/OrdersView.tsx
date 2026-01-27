import {useEffect, useState} from "react";
import type {GridColDef} from "@mui/x-data-grid";
import {getOrders} from "../../services/OrderService.ts"
import MyTable from "../ui/MyTable.tsx";
import type {Customer, OrderRow, Product} from "../../types/Types.ts";


const OrdersView = () => {

    const [rows, setRows] = useState<(Customer | Product | OrderRow)[]>(getOrders().map((order) => ({
        id: order.id,
        customer: `${order.customer?.name} ${order.customer?.lastName}`,
        products: order.products.map(p => p.product.name).join("\n"),
        quantity: order.products.map(p => p.quantity).join("\n"),
        address: order.address,
        date: order.date,
    })));

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
        getOrders().forEach(o=> console.log(o.products));
    }, [])

    return (
            <MyTable
                columns={columns}
                typeOf={"Orders"}
                setRows={setRows}
                rows={rows}
            ></MyTable>
    )

}

export default OrdersView;