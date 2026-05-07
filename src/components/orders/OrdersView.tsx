import {useEffect, useState} from "react";
import {
    type GridColDef,
    GridFilterInputValue, type GridFilterModel, type GridPaginationModel, type GridRowSelectionModel,
    type GridSortModel,
} from "@mui/x-data-grid";
import {getOrder, searchOrders} from "../../services/orderService.ts"
import MyTable from "../ui/MyTable.tsx";
import type {Customer, Driver, OrderItem, OrderRow, Product, ResponseDTO, Route} from "../../types/Types.ts";
import PopUpUpdate from "../ui/PopUpUpdate.tsx";
import IconButton from "@mui/material/IconButton";
import {EditIcon} from "lucide-react";
import PopUpDelete from "../ui/PopUpDelete.tsx";
import PopUpItemOperation from "../ui/popup/PopUpItemOperation.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import ProductsCell from "./ProductsCell.tsx";
import {type OrderStatusValue, orderStatusConfig} from "../../types/enums/OrderStatus.ts";
import {OrderStatus} from "../../types/enums/OrderStatus.ts";
import {PaymentStatus, paymentStatusConfig, type PaymentStatusValue} from "../../types/enums/PaymentStatus.ts";

interface OrdersViewProps {
    columnVisibility?: Record<string, boolean>;
    setColumnVisibility?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    selectionModel?: GridRowSelectionModel;
    setSelectionModel?: React.Dispatch<
        React.SetStateAction<GridRowSelectionModel>
    >;
    setOrdersRow?: React.Dispatch<React.SetStateAction<OrderRow[]>>;
    selection?: boolean;
    height?: string;
    width?: number;
    showSearchBar?: boolean;
    searchTerm?: string;
    filters?: GridFilterModel;
}
const OrdersView = ({columnVisibility,
                        setColumnVisibility,
                        setSelectionModel,
                        selection,
                        selectionModel,
                        setOrdersRow,
                        height,
                        width,
                        showSearchBar,
                    searchTerm,
                    filters}: OrdersViewProps) => {

    const [rows, setRows] = useState<(Customer | Product | OrderRow | Driver | Route)[]>([]);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchName, setSearchName] = useState(searchTerm ?? "");
    const [isSearching, setIsSearching] = useState(searchTerm ? true : false);
    const [openEdit, setOpenEdit] = useState(false);
    const [rowToEdit, setRowToEdit] = useState<OrderItem | Customer | Product | Driver | Route | undefined>();
    const [openDeletePopUp, setOpenDeletePopUp] = useState(false);
    const [onDeleteContent, setOnDeleteContent] = useState<OrderItem>();
    const [submitted, setSubmitted] = useState(false);
    const [operation, setOperation] = useState("");
    const [sortModel, setSortModel] = useState<GridSortModel>([{field: "date", sort: "asc"}]);
    const [filterModel, setFilterModel] = useState<GridFilterModel>(filters ?? {
        items: []
    });
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({page: 0, pageSize: 10})

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

    const handleUpdateOrder = (updated: OrderRow | Product | Customer | Driver | Route) => {
        setRows(prev => {
            const index = prev.findIndex(r => r.id === updated.id);

            if (index === -1) return prev;

            const newRows = [...prev];
            newRows[index] = { ...updated }; // IMPORTANT spread

            return newRows;
        });
    };

    const handleDeleteOrder = (id: number) => {
        setRows(prev => prev.filter(row => row.id !== id));
    };

    useEffect(() => {
        setLoading(true);
        searchOrders({
            page: paginationModel.page,
            pageSize: paginationModel.pageSize,
            globalSearch: isSearching ? (searchTerm ?? searchName) : "",
            sortBy: sortModel[0]?.field,
            sortDirection: sortModel[0]?.sort ?? "asc",
            filters: filterModel.items ?? []
        }).then(data => {
                const orders: OrderRow[] = [];
                data.content.forEach(order => {
                    orders.push({
                        id: order.id,
                        customer: order.customer,
                        products: order.items,
                        address: order.address,
                        status: order.status,
                        total: Number(Number(order.total).toFixed(2)),
                        paidAmount: Number(Number(order.paidAmount).toFixed(2)),
                        date: order.date ? new Date(order.date) : undefined,
                        paymentStatus: order.paymentStatus ?? ""
                    });
                });
                setRows(orders);
                setRowCount(data.totalElements);
                setOrdersRow?.(orders);
            })
            .catch(() => console.log("error fetching orders"))
            .finally(() => setLoading(false));
    }, [paginationModel, isSearching, searchName, sortModel, filterModel, searchTerm])

    return (
        <>
            <MyTable
                showSearchBar={showSearchBar}
                columns={columns}
                typeOf={"Orders"}
                rows={rows}
                loading={loading}
                rowCount={rowCount}
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
                setSearchName={setSearchName}
                setIsSearching={setIsSearching}
                setSortModel={setSortModel}
                sortModel={sortModel}
                filterModel={filterModel}
                setFilterModel={setFilterModel}
                columnVisibility={columnVisibility ?? {}}
                setColumnVisibility={setColumnVisibility}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
                selection={selection}
                height={height}
                width={width}
            ></MyTable>
            <PopUpUpdate
                open={openEdit}
                setOpen={setOpenEdit}
                rowToEdit={rowToEdit}
                typeOf={"Orders"}
                setSubmitted={setSubmitted}
                handleUpdate={handleUpdateOrder}
            />
            <PopUpDelete
                setRowToEdit={setRowToEdit}
                open={openDeletePopUp}
                rowToEdit={onDeleteContent}
                typeOf={"Orders"}
                setOpen={setOpenDeletePopUp}
                handleDelete={handleDeleteOrder}
                setSubmitted={setSubmitted}
            />
            <div className="flex justify-center items-center mt-2 w-full mx-auto">
                {submitted && (
                    <PopUpItemOperation
                        setSubmitted={setSubmitted}
                        typeOf={"order"}
                        item={rowToEdit as OrderItem}
                        operation={operation}
                    />
                )}
            </div>
        </>

    )

}

export default OrdersView;