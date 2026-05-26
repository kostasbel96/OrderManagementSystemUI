import {useEffect, useState, useMemo} from "react";
import { useTranslation } from 'react-i18next';
import {
    type GridFilterModel, type GridPaginationModel,
    type GridSortModel,
} from "@mui/x-data-grid";
import MyTable from "../ui/MyTable.tsx";
import type {
    Customer,
    Driver,
    OrderItem,
    OrderRow, Payment,
    Product, PurchaseOrderItem,
    Receipt,
    Route,
    Supplier
} from "../../types/Types.ts";
import PopUpDelete from "../ui/PopUpDelete.tsx";
import PopUpItemOperation from "../ui/popup/PopUpItemOperation.tsx";
import {searchReceipts} from "../../services/receiptService.ts";
import dayjs from "dayjs";
import getColumnConfigCustomerReceipt from "./config/getColumnConfigCustomerReceipt.tsx";
import getColumnConfigSupplierReceipt from "./config/getColumnConfigSupplierReceipt.tsx";
import {searchPayments} from "../../services/paymentService.ts";
import {useUIStore} from "../../hooks/store/useUIStore.ts";

const ReceiptsView = ({receiptType  = "receipt"}) => {
    const { t } = useTranslation();
    const refreshKey = useUIStore((s) => s.refreshKey);
    const { incrementRefreshKey, currency, locale} = useUIStore();

    const [rows, setRows] = useState<(Customer | Product | OrderRow | Driver | Route | Receipt | Payment)[]>([]);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchName, setSearchName] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [rowToEdit, setRowToEdit] = useState<OrderItem | Customer | Product | Driver | Route | Receipt | Supplier | PurchaseOrderItem | Payment | undefined>();
    const [openDeletePopUp, setOpenDeletePopUp] = useState(false);
    const [onDeleteContent, setOnDeleteContent] = useState<Receipt | Payment | undefined>();
    const [submitted, setSubmitted] = useState(false);
    const [operation, setOperation] = useState("");
    const [sortModel, setSortModel] = useState<GridSortModel>([{field: "date", sort: "asc"}]);
    const [filterModel, setFilterModel] = useState<GridFilterModel>({
        items: []
    });
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({page: 0, pageSize: 10})

    const handleDeleteReceipt = (id: number) => {
        setRows(prev => prev.filter(row => row.id !== id));
        incrementRefreshKey();
    };

    const columns = useMemo(() => receiptType === "receipt" ?
                        getColumnConfigCustomerReceipt({setOnDeleteContent, setOpenDeletePopUp, setOperation, currency, locale, t}) :
                        getColumnConfigSupplierReceipt({setOnDeleteContent, setOpenDeletePopUp, setOperation, currency, locale, t}),
    [receiptType, t, currency, locale]);

    useEffect(() => {
        setLoading(true);
        if (receiptType === "receipt"){
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
        } else if (receiptType === "payment") {
            searchPayments({
                page: paginationModel.page,
                pageSize: paginationModel.pageSize,
                globalSearch: isSearching ? searchName : "",
                sortBy: sortModel[0]?.field,
                sortDirection: sortModel[0]?.sort ?? "asc",
                filters: filterModel.items ?? []
            }).then(data => {
                const payments: Payment[] = [];
                data.content.forEach(payment => {
                    payments.push({
                        id: payment.id,
                        supplier: payment.supplier,
                        amount: Number(Number(payment.amount).toFixed(2)),
                        date: payment.date ? dayjs(payment.date).toDate() : "",
                        notes: payment.notes
                    });
                });
                setRows(payments);
                setRowCount(data.totalElements);
            })
                .catch(() => console.log("error fetching orders"))
                .finally(() => setLoading(false));
        }

    }, [paginationModel, isSearching, searchName, sortModel, filterModel, refreshKey])

    return (
        <>
            <MyTable
                columns={columns}
                typeOf={receiptType}
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
                typeOf={receiptType}
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

export default ReceiptsView;