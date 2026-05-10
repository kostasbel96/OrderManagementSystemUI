import {useEffect, useState} from "react";
import {
    type GridColDef,
    type GridFilterModel, type GridPaginationModel,
    type GridSortModel,
} from "@mui/x-data-grid";
import MyTable from "../ui/MyTable.tsx";
import type {
    Customer,
    Driver,
    OrderItem,
    OrderRow,
    Product,
    Receipt,
    ResponseDTO,
    Route,
    Supplier
} from "../../types/Types.ts";
import IconButton from "@mui/material/IconButton";
import PopUpDelete from "../ui/PopUpDelete.tsx";
import PopUpItemOperation from "../ui/popup/PopUpItemOperation.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import {getReceipt, searchReceipts} from "../../services/receiptService.ts";
import dayjs from "dayjs";

const OrdersView = () => {

    const [rows, setRows] = useState<(Customer | Product | OrderRow | Driver | Route | Receipt)[]>([]);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchName, setSearchName] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [rowToEdit, setRowToEdit] = useState<OrderItem | Customer | Product | Driver | Route | Receipt | Supplier | undefined>();
    const [openDeletePopUp, setOpenDeletePopUp] = useState(false);
    const [onDeleteContent, setOnDeleteContent] = useState<Receipt>();
    const [submitted, setSubmitted] = useState(false);
    const [operation, setOperation] = useState("");
    const [sortModel, setSortModel] = useState<GridSortModel>([{field: "date", sort: "asc"}]);
    const [filterModel, setFilterModel] = useState<GridFilterModel>({
        items: []
    });
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({page: 0, pageSize: 10})

    const handleOnDelete = (row: Receipt) =>{
        if (row.id) getReceipt(row.id).then((data: ResponseDTO)=> {
            setOnDeleteContent({...data.receipt});
            setOperation("deleted");
        }).finally(()=>setOpenDeletePopUp(true));
    }

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
        { field: 'amount', headerName: 'Amount', width: 80, type: "number", renderCell: (params) => (
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

    const handleDeleteReceipt = (id: number) => {
        setRows(prev => prev.filter(row => row.id !== id));
    };

    useEffect(() => {
        setLoading(true);
        searchReceipts({
            page: paginationModel.page,
            pageSize: paginationModel.pageSize,
            globalSearch: isSearching ? searchName : "",
            sortBy: sortModel[0]?.field,
            sortDirection: sortModel[0]?.sort ?? "asc",
            filters: filterModel.items ?? []
        }).then(data => {
                const receipts: Receipt[] = [];
                data.content.forEach(receipt => {
                    receipts.push({
                        id: receipt.id,
                        customer: receipt.customer,
                        amount: Number(Number(receipt.amount).toFixed(2)),
                        date: receipt.date ? dayjs(receipt.date).toDate() : "",
                        notes: receipt.notes
                    });
                });
                setRows(receipts);
                setRowCount(data.totalElements);
            })
            .catch(() => console.log("error fetching orders"))
            .finally(() => setLoading(false));
    }, [paginationModel, isSearching, searchName, sortModel, filterModel])

    return (
        <>
            <MyTable
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
            ></MyTable>
            <PopUpDelete
                setRowToEdit={setRowToEdit}
                open={openDeletePopUp}
                rowToEdit={onDeleteContent}
                typeOf={"Receipts"}
                setOpen={setOpenDeletePopUp}
                handleDelete={handleDeleteReceipt}
                setSubmitted={setSubmitted}
            />
            <div className="flex justify-center items-center mt-2 w-full mx-auto">
                {submitted && (
                    <PopUpItemOperation
                        setSubmitted={setSubmitted}
                        typeOf={"receipt"}
                        item={rowToEdit as Receipt}
                        operation={operation}
                    />
                )}
            </div>
        </>

    )

}

export default OrdersView;