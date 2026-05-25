import {type GridColDef, type GridFilterModel, type GridPaginationModel, type GridSortModel} from '@mui/x-data-grid';
import {useEffect, useMemo, useState} from "react";
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
import MyTable from "../ui/MyTable.tsx";
import { useTranslation } from 'react-i18next';
import { searchProducts } from "../../services/productService.ts";
import IconButton from "@mui/material/IconButton";
import {EditIcon} from "lucide-react";
import PopUpUpdate from "../ui/PopUpUpdate.tsx";
import DeleteIcon from '@mui/icons-material/Delete';
import PopUpDelete from "../ui/PopUpDelete.tsx";
import PopUpItemOperation from "../ui/popup/PopUpItemOperation.tsx";
import {Tooltip} from "@mui/material";
import {useUIStore} from "../../hooks/store/useUIStore.ts";
import {formatCurrency} from "../../helper/currencyHelper.ts";

const ProductsView = () => {
    const { t } = useTranslation();
    const { incrementRefreshKey, currency, locale } = useUIStore();
    const refreshKey = useUIStore((s) => s.refreshKey);
    const [rows, setRows] = useState<(Product | Customer | OrderRow | Driver | Route | Receipt | Supplier)[]>([]);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({page: 0, pageSize: 10})
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [rowToEdit, setRowToEdit] = useState<Product | Customer | OrderItem | Driver | Route | Payment | Receipt | Supplier | PurchaseOrderItem |undefined>();
    const [openDeletePopUp, setOpenDeletePopUp] = useState(false);
    const [onDeleteContent, setOnDeleteContent] = useState<Product>();
    const [submitted, setSubmitted] = useState(false);
    const [operation, setOperation] = useState("");
    const [searchName, setSearchName] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [sortModel, setSortModel] = useState<GridSortModel>([{field: "name", sort: "asc"}]);
    const [filterModel, setFilterModel] = useState<GridFilterModel>({
        items: []
    });

    const handleClickOpen = (row: Product) => {
        setOpenEdit(true);
        setRowToEdit(row);
        setOperation("updated");
    };

    const handleOnDelete = (row: Product) =>{
        setOpenDeletePopUp(true);
        setOnDeleteContent(row);
        setOperation("deleted");
    }


    const columns = useMemo<GridColDef[]>(() => [
        { field: 'id', headerName: t('products.table.id'), width: 20, renderCell: (params) => (
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
        { field: 'name', headerName: t('products.table.productName'), width: 300, renderCell: (params) => (
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
        {
            field: 'description',
            headerName: t('products.table.description'),
            width: 200,
            renderCell: (params) => {
                const value = params.value || "";

                return (
                    <Tooltip title={value} arrow placement="top-start">
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',   // ✅ vertical center
                                height: '100%',
                                width: '100%',
                                cursor: 'pointer'
                            }}
                        >
                            <div
                                style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    width: '100%'
                                }}
                            >
                                {value}
                            </div>
                        </div>
                    </Tooltip>
                );
            }
        },
        {field: 'quantity', headerName: t('products.table.quantity'), type:"number", width: 100, renderCell: (params) => (
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
                    {params.value}
                </div>
            ) },
        {field: 'price', headerName: t('products.table.price'), width: 100, type:"number", renderCell: (params) => (
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
            ) },
        {
            field: 'actions',
            headerName: t('products.table.actions'),
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
    ], [t]);

    const handleUpdateProduct = (updated: Product | Customer | OrderRow | Driver | Route | Receipt | Supplier) => {
        setRows(prev => {
            const index = prev.findIndex(r => r.id === updated.id);

            if (index === -1) return prev;

            const newRows = [...prev];
            newRows[index] = { ...updated }; // IMPORTANT spread

            return newRows;
        });
        incrementRefreshKey();
    };

    const handleDeleteProduct = (id: number) => {
        setRows(prev => prev.filter(row => row.id !== id));
        incrementRefreshKey();
    };

    useEffect(() => {
        setLoading(true);
        searchProducts({
            page: paginationModel.page,
            pageSize: paginationModel.pageSize,
            globalSearch: isSearching ? searchName : "",
            sortBy: sortModel[0]?.field,
            sortDirection: sortModel[0]?.sort ?? "asc",
            filters: filterModel.items ?? []
        }).then((data) => {
                setRows(data.content);
                setRowCount(data.totalElements);
        }).finally(() => setLoading(false));
    }, [paginationModel, searchName, isSearching, sortModel, filterModel, refreshKey]);

    return (
        <>
            <MyTable
                columns={columns}
                typeOf={"Products"}
                rows={rows}
                loading={loading}
                rowCount={rowCount}
                setPaginationModel={setPaginationModel}
                paginationModel={paginationModel}
                setSearchName={setSearchName}
                setIsSearching={setIsSearching}
                setSortModel={setSortModel}
                sortModel={sortModel}
                filterModel={filterModel}
                setFilterModel={setFilterModel}
                selection={false}
            ></MyTable>
            <PopUpUpdate
                handleUpdate={handleUpdateProduct}
                open={openEdit}
                rowToEdit={rowToEdit}
                typeOf={"Products"}
                setOpen={setOpenEdit}
                setSubmitted={setSubmitted}
            />
            <PopUpDelete
                handleDelete={handleDeleteProduct}
                setRowToEdit={setRowToEdit}
                open={openDeletePopUp}
                rowToEdit={onDeleteContent}
                typeOf={"Products"}
                setOpen={setOpenDeletePopUp}
                setSubmitted={setSubmitted}
            />
            <div className="flex justify-center items-center mt-2 w-full mx-auto">
                {submitted && (
                    <PopUpItemOperation
                        setSubmitted={setSubmitted}
                        typeOf={"product"}
                        item={rowToEdit as Product}
                        operation={operation}
                    />
                )}
            </div>


        </>

    )

}

export default ProductsView;