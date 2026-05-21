import type {
    Customer,
    Driver,
    OrderItem,
    OrderRow, PurchaseOrderItem,
    Product,
    Receipt,
    ResponseDTO,
    Route,
    Supplier, Payment
} from "../../../types/Types.ts";
import {type GridColDef, GridFilterInputValue} from "@mui/x-data-grid";
import {getOrder} from "../../../services/orderService.ts";
import ProductsCell from "../ProductsCell.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import {EditIcon} from "lucide-react";
import {PaymentStatus, paymentStatusConfig, type PaymentStatusValue} from "../../../types/enums/PaymentStatus.ts";
import {OrderStatus, orderStatusConfig, type OrderStatusValue} from "../../../types/enums/OrderStatus.ts";
import type {SetStateAction} from "react";


interface ColumnConfigCustomerOrdersProps {
    setOnDeleteContent: React.Dispatch<SetStateAction<OrderItem | PurchaseOrderItem | undefined>>;
    setOperation: React.Dispatch<SetStateAction<string>>;
    setOpenEdit: React.Dispatch<SetStateAction<boolean>>;
    setOpenDeletePopUp: React.Dispatch<SetStateAction<boolean>>;
    setRowToEdit: React.Dispatch<SetStateAction<OrderItem | Customer | Product | Driver | Payment | Route | Receipt | Supplier | PurchaseOrderItem | undefined>>;
}

const getColumnConfigCustomerOrders = ({
                                    setOpenEdit,
                                    setOnDeleteContent,
                                    setOpenDeletePopUp,
                                    setOperation,
                                    setRowToEdit
                                    }: ColumnConfigCustomerOrdersProps) => {

    const productsFilterOperator = {
        label: 'contains',
        value: 'containsProduct',
        InputComponent: GridFilterInputValue,
    } as any;

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 20, renderCell: (params) => (
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
        { field: 'customer', headerName: 'Customer', width: 200,
            valueGetter: (_, row) =>
                `${row.customer?.name ?? ''} ${row.customer?.lastName ?? ''}`,renderCell: (params) => (
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
            width: 150,
            filterOperators: [productsFilterOperator],
            sortable: false,
            renderCell: (params) => (
                <div className="flex items-center justify-start h-full">
                    <ProductsCell
                        products={params.row.products}
                    />
                </div>
            ),
        },
        {field: 'address', headerName: 'Address', width: 160, renderCell: (params) => (
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
        { field: 'total', headerName: 'Total', width: 80, type: "number", renderCell: (params) => (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'end',
                        height: '100%',
                    }}
                >
                    {params.value ? params.value + " €" : ""}
                </div>
            ) },
        { field: 'paidAmount', headerName: 'Paid', width: 80, type: "number", renderCell: (params) => (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'end',
                        height: '100%',
                    }}
                >
                    {params.value ?? ""}
                </div>
            ) },
        {field: 'date', headerName: 'Date', type: 'date', width: 80, renderCell: (params) => (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',   // vertical centering
                    justifyContent: 'start', // horizontal centering
                    whiteSpace: 'pre-line',
                    height: '100%',          // σημαντικό για να γεμίζει το cell
                    width: '100%',
                }}>
                    {params.value
                        ? params.value.toLocaleDateString()
                        : ''}
                </div>
            )},
        {
            field: 'paymentStatus', headerName: 'Payment Status', type: 'singleSelect', width: 150,
            valueOptions: Object.values(PaymentStatus),
            renderCell: (params) => {
                const cfg = paymentStatusConfig[params.row.paymentStatus as PaymentStatusValue];
                if (!cfg) return params.row.paymentStatus;
                return (
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '3px 10px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 500,
                    background: cfg.bg,
                    color: cfg.color,
                    border: `0.5px solid ${cfg.border}`,
                    whiteSpace: 'nowrap',
                }}>
                    <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: cfg.dot, flexShrink: 0,
                    }} />
                    {params.row.paymentStatus}
                </span>
                    </div>
                );
            }
        },
        {
            field: 'status', headerName:'Status', type: 'singleSelect', width: 140,
            valueOptions: Object.values(OrderStatus),
            renderCell: (params) => {
                const cfg = orderStatusConfig[params.row.status as OrderStatusValue];
                if (!cfg) return params.row.status;
                return (
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '3px 10px',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 500,
                            background: cfg.bg,
                            color: cfg.color,
                            border: `0.5px solid ${cfg.border}`,
                            whiteSpace: 'nowrap',
                        }}>
                          <span style={{
                              width: 6, height: 6, borderRadius: '50%',
                              background: cfg.dot, flexShrink: 0,
                          }} />
                            {params.row.status}
                        </span>
                    </div>
                );
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'start'
                    }}
                >
                    <IconButton
                        color="primary"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleClickOpen(params.row);
                        }}
                    >
                        <EditIcon size={18}/>
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleOnDelete(params.row);
                        }}
                    >
                        <DeleteIcon sx={{ fontSize: 18 }}/>
                    </IconButton>
                </div>
            ),
        },
    ];

    const handleClickOpen = (row: OrderRow) => {
        if (row.id) getOrder(row.id).then((data: ResponseDTO)=> {
            setRowToEdit({...data.orderItem});
            setOperation("updated");
        }).finally(()=>setOpenEdit(true));

    }

    const handleOnDelete = (row: OrderRow) =>{
        if (row.id) getOrder(row.id).then((data: ResponseDTO)=> {
            setOnDeleteContent({...data.orderItem});
            setOperation("deleted");
        }).finally(()=>setOpenDeletePopUp(true));
    }

    return columns;

}

export default getColumnConfigCustomerOrders;



