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
import ProductsCell from "../ProductsCell.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import {EditIcon} from "lucide-react";
import {PaymentStatus, paymentStatusConfig, type PaymentStatusValue} from "../../../types/enums/PaymentStatus.ts";
import {OrderStatus, orderStatusConfig, type OrderStatusValue} from "../../../types/enums/OrderStatus.ts";
import type {SetStateAction} from "react";
import {getPurchaseOrder} from "../../../services/purchaseOrderService.ts";
import {formatCurrency} from "../../../helper/currencyHelper.ts";


interface ColumnConfigCustomerOrdersProps {
    setOnDeleteContent: React.Dispatch<SetStateAction<OrderItem | PurchaseOrderItem | undefined>>;
    setOperation: React.Dispatch<SetStateAction<string>>;
    setOpenEdit: React.Dispatch<SetStateAction<boolean>>;
    setOpenDeletePopUp: React.Dispatch<SetStateAction<boolean>>;
    setRowToEdit: React.Dispatch<SetStateAction<OrderItem | Customer | Product | Driver | Route | Receipt | Payment | Supplier | PurchaseOrderItem | undefined>>;
    currency: string;
    locale: string;
    t: any;
}

const getColumnConfigSupplierOrders = ({
                                           setOpenEdit,
                                           setOnDeleteContent,
                                           setOpenDeletePopUp,
                                           setOperation,
                                           setRowToEdit,
                                           currency,
                                           locale,
                                           t
                                        }: ColumnConfigCustomerOrdersProps) => {

    const productsFilterOperator = {
        label: t ? t('search.contains') : 'contains',
        value: 'containsProduct',
        InputComponent: GridFilterInputValue,
    } as any;

    const columns: GridColDef[] = [
        { field: 'id', headerName: t('orders.table.id'), width: 20, renderCell: (params) => (
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
        { field: 'supplier', headerName: t('orders.table.supplier'), width: 200,
            valueGetter: (_, row) =>
                `${row.supplier?.name ?? ''}`,renderCell: (params) => (
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
            headerName: t('orders.table.products'),
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
        { field: 'total', headerName: t('orders.table.total'), width: 80, type: "number", renderCell: (params) => (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'end',
                        height: '100%',
                    }}
                >
                    {formatCurrency(params.value, currency, locale)}
                </div>
            ) },
        { field: 'paidAmount', headerName: t('orders.table.paid'), width: 120, type: "number", renderCell: (params) => (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'end',
                        height: '100%',
                    }}
                >
                    {formatCurrency(params.value, currency, locale)}
                </div>
            ) },
        {field: 'date', headerName: t('orders.table.date'), type: 'date', width: 120, renderCell: (params) => (
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
            field: 'paymentStatus', headerName: t('orders.table.paymentStatus'), type: 'singleSelect', width: 150,
            valueOptions: Object.values(PaymentStatus).map((value) => (
                    {
                        value,
                        label: t(`paymentStatus.${value}`)
                    }
                )
            ),
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
                    {t(`paymentStatus.${params.row.paymentStatus}`)}
                </span>
                    </div>
                );
            }
        },
        {
            field: 'status', headerName: t('orders.table.status'), type: 'singleSelect', width: 140,
            valueOptions: Object.values(OrderStatus).map((value) => (
                    {
                        value,
                        label: t(`orderStatus.${value}`)
                    }
                )
            ),
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
                            {t(`orderStatus.${params.row.status}`)}
                        </span>
                    </div>
                );
            }
        },
        {
            field: 'actions',
            headerName: t('orders.table.actions'),
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
        if (row.id) getPurchaseOrder(row.id).then((data: ResponseDTO)=> {
            setRowToEdit({...data.purchaseOrderItem});
            setOperation("updated");
        }).finally(()=>setOpenEdit(true));

    }

    const handleOnDelete = (row: OrderRow) =>{
        if (row.id) getPurchaseOrder(row.id).then((data: ResponseDTO)=> {
            setOnDeleteContent({...data.purchaseOrderItem});
            setOperation("deleted");
        }).finally(()=>setOpenDeletePopUp(true));
    }

    return columns;

}

export default getColumnConfigSupplierOrders;



