import {useEffect, useState} from "react";
import {type GridColDef, GridFilterInputValue, type GridFilterOperator, type GridSortModel} from "@mui/x-data-grid";
import {getOrder, getOrders, searchOrderByCustomerName} from "../../services/orderService.ts"
import MyTable from "../ui/MyTable.tsx";
import type {Customer, OrderItem, OrderRow, Product, ResponseDTO, SelectedProduct} from "../../types/Types.ts";
import PopUpUpdate from "../ui/PopUpUpdate.tsx";
import IconButton from "@mui/material/IconButton";
import {EditIcon} from "lucide-react";
import PopUpDelete from "../ui/PopUpDelete.tsx";
import PopUpItemOperation from "../popup/PopUpItemOperation.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import ProductsCell from "./ProductsCell.tsx";


const OrdersView = () => {

    const [rows, setRows] = useState<(Customer | Product | OrderRow)[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchName, setSearchName] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [rowToEdit, setRowToEdit] = useState<OrderItem | Customer | Product | undefined>();
    const [openDeletePopUp, setOpenDeletePopUp] = useState(false);
    const [onDeleteContent, setOnDeleteContent] = useState<OrderItem>();
    const [submitted, setSubmitted] = useState(false);
    const [operation, setOperation] = useState("");
    const [sortModel, setSortModel] = useState<GridSortModel>([{field: "date", sort: "asc"}]);
    const [openRows, setOpenRows] = useState<{[key: string]: boolean}>({});

    const toggleRow = (id: string) => {
        setOpenRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

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

    const productsFilterOperator: GridFilterOperator = {
        label: 'contains',
        value: 'containsProduct',
        getApplyFilterFn: (filterItem) => {
            if (!filterItem.value) return null;

            return (row) => {
                const products = row as SelectedProduct[];

                if (!products || products.length === 0) return false;

                return products.some(p =>
                    p.product.name
                        .toLowerCase()
                        .includes(String(filterItem.value).toLowerCase())
                );
            };
        },
        InputComponent: GridFilterInputValue,
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 60, renderCell: (params) => (
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
        { field: 'customer', headerName: 'Customer', width: 240, renderCell: (params) => (
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
            width: 340,
            filterOperators: [productsFilterOperator],
            sortable: false,
            renderCell: (params) => (
                <div className="flex items-center justify-start h-full">
                    <ProductsCell
                        products={params.row.products}
                        open={openRows[params.row.id]}
                        onToggle={() => toggleRow(params.row.id)}
                    />
                </div>
            ),
        },
        {field: 'address', headerName: 'Address', width: 180, renderCell: (params) => (
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
        { field: 'total', headerName: 'Total', width: 120, renderCell: (params) => (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'start',
                        height: '100%',
                    }}
                >
                    {params.value ? params.value + " €" : ""}
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
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={(event) => {
                            event.stopPropagation();
                            handleOnDelete(params.row);
                        }}
                    >
                        <DeleteIcon/>
                    </IconButton>
                </div>
            ),
        },
    ];

    useEffect(() => {
        setLoading(true);
        const fetcher = isSearching
            ? searchOrderByCustomerName(searchName, page, pageSize, sortModel[0]?.field, sortModel[0]?.sort ?? "asc" )
            : getOrders(page, pageSize, sortModel[0]?.field, sortModel[0]?.sort ?? "asc");
        fetcher
            .then(data => {
                const orders: OrderRow[] = [];
                data.content.forEach(order => {
                    // Calculate total
                    // const orderTotal = order.items
                    //     .reduce((sum, item) => sum + (item.quantity * item.price), 0);
                    orders.push({
                        id: order.id,
                        customer: `${order.customer?.name} ${order.customer?.lastName}`,
                        products: order.items,
                        address: order.address,
                        total: Number(order.total),
                        date: order.date ? new Date(order.date) : undefined
                    });
                });
                setRows(orders);
                setRowCount(data.totalElements);
                setPage(data.pageNumber);
                setPageSize(data.pageSize);
            })
            .catch(() => console.log("error fetching orders"))
            .finally(() => setLoading(false));
    }, [page, pageSize, isSearching, searchName, openEdit, openDeletePopUp, sortModel])

    return (
        <>
            <MyTable
                columns={columns}
                typeOf={"Orders"}
                rows={rows}
                loading={loading}
                setPage={setPage}
                rowCount={rowCount}
                setPageSize={setPageSize}
                page={page}
                pageSize={pageSize}
                setSearchName={setSearchName}
                setIsSearching={setIsSearching}
                setSortModel={setSortModel}
                sortModel={sortModel}
            ></MyTable>
            <PopUpUpdate
                open={openEdit}
                setOpen={setOpenEdit}
                rowToEdit={rowToEdit}
                typeOf={"Orders"}
                setSubmitted={setSubmitted}
            />
            <PopUpDelete
                setRowToEdit={setRowToEdit}
                open={openDeletePopUp}
                rowToEdit={onDeleteContent}
                typeOf={"Orders"}
                setOpen={setOpenDeletePopUp}
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