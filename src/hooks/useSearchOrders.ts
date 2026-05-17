import { useState, useCallback } from "react";
import type {
    OrderRow,
    OrderResponseDto,
    Customer,
    Product,
    Driver,
    Route,
    Receipt,
    Supplier,
    PurchaseOrderItemResponseDto, OrderItem, PurchaseOrderItem
} from "../types/Types.ts";
import {searchOrders} from "../services/orderService.ts";
import type {GridPaginationModel, GridSortModel, GridFilterModel} from "@mui/x-data-grid";
import {searchSupplierOrders} from "../services/purchaseOrderService.ts";

type OrderType = "orderCustomer" | "orderSupplier";

interface UseSearchOrdersProps {
    orderType: OrderType;
    paginationModel: GridPaginationModel;
    sortModel: GridSortModel;
    filterModel: GridFilterModel;
    searchTerm?: string;
    searchName?: string;
    isSearching: boolean;
    setRows: React.Dispatch<React.SetStateAction<(Customer | Product | OrderRow | Driver | Route | Receipt | Supplier)[]>>;
    setRowCount: React.Dispatch<React.SetStateAction<number>>;
    setOrdersRow?: React.Dispatch<React.SetStateAction<OrderRow[]>>;
}

const useSearchOrders = ({
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
                         }: UseSearchOrdersProps) => {
    const [loading, setLoading] = useState(false);

    const mapCustomerOrder = (order: OrderItem): OrderRow => ({
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

    const mapPurchaseOrderItem = (order: PurchaseOrderItem): OrderRow => ({
        id: order.id,
        supplier: order.supplier,
        products: order.items,
        status: order.status,
        total: Number(Number(order.total).toFixed(2)),
        paidAmount: Number(Number(order.paidAmount).toFixed(2)),
        date: order.date ? new Date(order.date) : undefined,
        paymentStatus: order.paymentStatus ?? ""
    });

    const search = useCallback(() => {
        setLoading(true);
        if (orderType === "orderCustomer") {
            searchOrders({
                page: paginationModel.page,
                pageSize: paginationModel.pageSize,
                globalSearch: isSearching ? (searchTerm ?? searchName) : "",
                sortBy: sortModel[0]?.field,
                sortDirection: sortModel[0]?.sort ?? "asc",
                filters: filterModel.items ?? [] })
                .then((data: OrderResponseDto) => {
                    const orders = data.content.map(mapCustomerOrder);
                    setRows(orders);
                    setRowCount(data.totalElements);
                    setOrdersRow?.(orders);
                })
                .catch(() => console.log("error fetching orders"))
                .finally(() => setLoading(false));
        } else {
            searchSupplierOrders({
                page: paginationModel.page,
                pageSize: paginationModel.pageSize,
                globalSearch: isSearching ? (searchTerm ?? searchName) : "",
                sortBy: sortModel[0]?.field,
                sortDirection: sortModel[0]?.sort ?? "asc",
                filters: filterModel.items ?? []})
                .then((data: PurchaseOrderItemResponseDto) => {
                    const orders = data.content.map(mapPurchaseOrderItem);
                    setRows(orders);
                    setRowCount(data.totalElements);
                    setOrdersRow?.(orders);
                })
                .catch(() => console.log("error fetching orders"))
                .finally(() => setLoading(false));
        }
    }, [orderType, paginationModel, sortModel, filterModel, searchTerm, searchName, isSearching]);

    return {loading, search}

}

export default useSearchOrders;