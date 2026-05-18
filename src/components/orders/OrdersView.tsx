import {useEffect, useState} from "react";
import {
    type GridColDef, type GridFilterModel, type GridPaginationModel, type GridRowSelectionModel,
    type GridSortModel,
} from "@mui/x-data-grid";
import MyTable from "../ui/MyTable.tsx";
import type {
    Customer,
    Driver,
    OrderItem,
    OrderRow, PurchaseOrderItem,
    Product,
    Receipt,
    Route,
    Supplier
} from "../../types/Types.ts";
import PopUpUpdate from "../ui/PopUpUpdate.tsx";
import PopUpDelete from "../ui/PopUpDelete.tsx";
import PopUpItemOperation from "../ui/popup/PopUpItemOperation.tsx";
import getColumnConfigCustomerOrders from "./config/getColumnConfigCustomerOrders.tsx";
import useSearchOrders from "../../hooks/useSearchOrders.ts";
import getColumnConfigSupplierOrders from "./config/getColumnConfigSupplierOrders.tsx";

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
    orderType?: "orderCustomer" | "orderSupplier";
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
                        orderType = "orderCustomer",
                    filters}: OrdersViewProps) => {

    const [rows, setRows] = useState<(Customer | Product | OrderRow | Driver | Route | Receipt | Supplier)[]>([]);
    const [rowCount, setRowCount] = useState(0);
    const [searchName, setSearchName] = useState(searchTerm ?? "");
    const [isSearching, setIsSearching] = useState(!!searchTerm);
    const [openEdit, setOpenEdit] = useState(false);
    const [rowToEdit, setRowToEdit] = useState<OrderItem | Customer | Product | Driver | Route | Receipt | Supplier | PurchaseOrderItem | undefined>();
    const [openDeletePopUp, setOpenDeletePopUp] = useState(false);
    const [onDeleteContent, setOnDeleteContent] = useState<OrderItem>();
    const [submitted, setSubmitted] = useState(false);
    const [operation, setOperation] = useState("");
    const [sortModel, setSortModel] = useState<GridSortModel>([{field: "date", sort: "asc"}]);
    const [filterModel, setFilterModel] = useState<GridFilterModel>(filters ?? {
        items: []
    });
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({page: 0, pageSize: 10})


    const columns: GridColDef[] = orderType === "orderCustomer"
        ? getColumnConfigCustomerOrders({
            setOpenEdit,
            setOnDeleteContent,
            setOpenDeletePopUp,
            setOperation,
            setRowToEdit
        })
        : getColumnConfigSupplierOrders({
            setOpenEdit,
            setOnDeleteContent,
            setOpenDeletePopUp,
            setOperation,
            setRowToEdit
        });

    const {loading, search} = useSearchOrders({
        orderType,
        paginationModel,
        sortModel,
        filterModel,
        searchTerm,
        searchName,
        isSearching,
        setRows,
        setRowCount,
        setOrdersRow,
    });

    const handleUpdateOrder = (updated: OrderRow | Product | Customer | Driver | Route | Receipt | Supplier) => {
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
        search();
    }, [search])

    return (
        <>
            <MyTable
                showSearchBar={showSearchBar}
                columns={columns}
                typeOf={orderType}
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