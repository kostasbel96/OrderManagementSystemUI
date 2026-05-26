import type {GridColDef, GridFilterModel, GridPaginationModel, GridSortModel} from "@mui/x-data-grid";
import MyTable from "../ui/MyTable.tsx";
import {useEffect, useState, useMemo} from "react";
import type {
    Customer,
    Driver,
    OrderItem,
    OrderRow, Payment,
    Product,
    PurchaseOrderItem,
    Receipt,
    Route,
    Supplier
} from "../../types/Types.ts";
import {searchCustomers} from "../../services/customerService.ts";
import IconButton from "@mui/material/IconButton";
import {EditIcon} from "lucide-react";
import PopUpUpdate from "../ui/PopUpUpdate.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import PopUpDelete from "../ui/PopUpDelete.tsx";
import PopUpItemOperation from "../ui/popup/PopUpItemOperation.tsx";
import { useTranslation } from 'react-i18next';
import {useUIStore} from "../../hooks/store/useUIStore.ts";
import {formatCurrency} from "../../helper/currencyHelper.ts";
 
const CustomersView = () => {
    const { t } = useTranslation();
    const refreshKey = useUIStore((s) => s.refreshKey);
    const { incrementRefreshKey, currency, locale} = useUIStore();

    const [rows, setRows] = useState<(Product | Customer | OrderRow | Driver | Route | Receipt | Supplier)[]>([]);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({page: 0, pageSize: 10})
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [rowToEdit, setRowToEdit] = useState<OrderItem | Customer | Product | Driver | Route | Receipt | Payment | Supplier | PurchaseOrderItem | undefined>();
    const [openDeletePopUp, setOpenDeletePopUp] = useState(false);
    const [onDeleteContent, setOnDeleteContent] = useState<Customer>();
    const [submitted, setSubmitted] = useState(false);
    const [operation, setOperation] = useState("");
    const [searchName, setSearchName] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [sortModel, setSortModel] = useState<GridSortModel>([{field: "name", sort: "asc"}]);
    const [filterModel, setFilterModel] = useState<GridFilterModel>({
        items: []
    });

    const handleClickOpen = (row: Customer) => {
        setOpenEdit(true);
        setRowToEdit(row);
        setOperation("updated");
    };

    const handleOnDelete = (row: Customer) =>{
        setOpenDeletePopUp(true);
        setOnDeleteContent(row);
        setOperation("deleted");
    }

    const columns: GridColDef[] = useMemo(() => [
        { field: 'id', headerName: t('customers.table.id'), width: 20, renderCell: (params) => (
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
        { field: 'name', headerName: t('customers.table.name'), width: 150, renderCell: (params) => (
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
        { field: 'lastName', headerName: t('customers.table.lastName'), width: 150, renderCell: (params) => (
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
        {field: 'email', headerName: t('customers.table.email'), width: 150, renderCell: (params) => (
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
        {field: 'phoneNumber1', headerName: t('customers.table.phoneNumber1'), width: 150, renderCell: (params) => (
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
        {field: 'phoneNumber2', headerName: t('customers.table.phoneNumber2'), width: 150, renderCell: (params) => (
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
            field: 'balance', headerName: t('customers.table.balance'), type: "number", width: 150, renderCell: (params) => (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',   // vertical centering
                        justifyContent: 'end', // horizontal centering
                        whiteSpace: 'pre-line',
                        height: '100%',          // σημαντικό για να γεμίζει το cell
                        width: '100%',
                        marginBottom: '24px'
                    }}
                >
                    {formatCurrency(params.value, currency, locale)}
                </div>
            )
        },
        {
            field: 'actions',
            headerName: t('customers.table.actions'),
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
    ], [t, currency, locale]);

    const handleUpdateCustomer = (updated: Product | Customer | OrderRow | Driver | Route | Receipt | Supplier) => {
        setRows(prev => {
            const index = prev.findIndex(r => r.id === updated.id);

            if (index === -1) return prev;

            const newRows = [...prev];
            newRows[index] = { ...updated }; // IMPORTANT spread

            return newRows;
        });
        incrementRefreshKey();
    };

    const handleDeleteCustomer = (id: number) => {
        setRows(prev => prev.filter(row => row.id !== id));
        incrementRefreshKey();
    };

    useEffect(() => {
        setLoading(true);
        searchCustomers({
            page: paginationModel.page,
            pageSize: paginationModel.pageSize,
            globalSearch: isSearching ? searchName : "",
            sortBy: sortModel[0]?.field,
            sortDirection: sortModel[0]?.sort ?? "asc",
            filters: filterModel.items ?? []
        }).then((data) => {
                setRows(data.content);
                setRowCount(data.totalElements);
            })
            .finally(() => setLoading(false));
    }, [paginationModel, searchName, isSearching, sortModel, filterModel, refreshKey]);


    return (
        <>
            <MyTable
                columns={columns}
                typeOf={"Customers"}
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
                selection={false}
            ></MyTable>
            <PopUpUpdate
                handleUpdate={handleUpdateCustomer}
                open={openEdit}
                setOpen={setOpenEdit}
                rowToEdit={rowToEdit}
                typeOf={"Customers"}
                setSubmitted={setSubmitted}
            />
            <PopUpDelete
                handleDelete={handleDeleteCustomer}
                setRowToEdit={setRowToEdit}
                open={openDeletePopUp}
                rowToEdit={onDeleteContent}
                typeOf={"Customers"}
                setOpen={setOpenDeletePopUp}
                setSubmitted={setSubmitted}
            />
            <div className="flex justify-center items-center mt-2 w-full mx-auto">
                {submitted && (
                    <PopUpItemOperation
                        setSubmitted={setSubmitted}
                        typeOf={"customer"}
                        item={rowToEdit as Customer}
                        operation={operation}
                    />
                )}
            </div>
        </>

    );

}

export default CustomersView;