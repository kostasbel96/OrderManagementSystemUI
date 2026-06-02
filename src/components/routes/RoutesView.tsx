import {useEffect, useState} from "react";
import {
    type GridColDef,
    type GridFilterModel, type GridPaginationModel, type GridRowSelectionModel,
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
    ResponseDTO,
    Route,
    Supplier
} from "../../types/Types.ts";
import PopUpUpdate from "../ui/PopUpUpdate.tsx";
import IconButton from "@mui/material/IconButton";
import {EditIcon, Printer} from "lucide-react";
import PopUpDelete from "../ui/PopUpDelete.tsx";
import PopUpItemOperation from "../ui/popup/PopUpItemOperation.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import {getRoute, searchRoutes} from "../../services/routeService.ts";
import {RouteStatus, type RouteStatusValue, statusConfig} from "../../types/enums/RouteStatus.ts";
import { Tooltip } from "@mui/material";
import dayjs from "dayjs";
import {useUIStore} from "../../hooks/store/useUIStore.ts";
import {useTranslation} from "react-i18next";
import PrintableTable from "./PrintableTable.tsx";

interface RoutesViewProps {
    columnVisibility?: Record<string, boolean>;
    setColumnVisibility?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    selectionModel?: GridRowSelectionModel;
    setSelectionModel?: React.Dispatch<
        React.SetStateAction<GridRowSelectionModel>
    >;
    selection?: boolean;
    height?: string;
    width?: number;
    filters?: GridFilterModel;
}
const RoutesView = ({columnVisibility,
                        setColumnVisibility,
                        setSelectionModel,
                        selection,
                        selectionModel,
                        height,
                        width,
                        filters}: RoutesViewProps) => {

    const refreshKey = useUIStore((s) => s.refreshKey);
    const { incrementRefreshKey } = useUIStore();
    const { t } = useTranslation();

    const [rows, setRows] = useState<(Customer | Product | OrderRow | Driver | Route | Receipt | Supplier)[]>([]);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchName, setSearchName] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [rowToEdit, setRowToEdit] = useState<OrderItem | Customer | Product | Driver | Route | Payment | Receipt | Supplier | PurchaseOrderItem | undefined>();
    const [openDeletePopUp, setOpenDeletePopUp] = useState(false);
    const [onDeleteContent, setOnDeleteContent] = useState<Route>();
    const [submitted, setSubmitted] = useState(false);
    const [operation, setOperation] = useState("");
    const [sortModel, setSortModel] = useState<GridSortModel>([{field: "date", sort: "asc"}]);
    const [filterModel, setFilterModel] = useState<GridFilterModel>(filters ?? {
        items: []
    });
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({page: 0, pageSize: 10});
    const [printRow, setPrintRow] = useState<Route | null>(null);

    const handleClickOpen = (row: OrderRow) => {
        if (row.id) getRoute(row.id).then((data: ResponseDTO)=> {
            setRowToEdit({...data.route});
            setOperation("updated");
        }).finally(()=>setOpenEdit(true));

    }

    const handleOnDelete = (row: OrderRow) =>{
        if (row.id) getRoute(row.id).then((data: ResponseDTO)=> {
            setOnDeleteContent({...data.route});
            setOperation("deleted");
        }).finally(()=>setOpenDeletePopUp(true));
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: t('routes.id'), width: 20, renderCell: (params) => (
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
        {field: 'name', headerName: t('routes.name'), width: 160, renderCell: (params) => (
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
        { field: 'driver', headerName: t('routes.driver'), width: 200,
            valueGetter: (_, row) =>
                `${row.driver?.name ?? ''} ${row.driver?.lastName ?? ''}`,renderCell: (params) => (
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
        { field: 'notes', headerName: t('routes.notes'), width: 120, renderCell: (params) => {
                const value = params.value || "";
                return <Tooltip title={value} arrow placement="top-start">
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
                                display: 'block', // πιο safe από flex εδώ
                                width: '100%',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {value}
                        </div>
                    </div>
                </Tooltip>
            } },
        {field: 'date', headerName: t('routes.date'), type: 'date', width: 120, renderCell: (params) => (
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
            field: 'orders', headerName:t('routes.orders'), width: 100, renderCell: (params) => (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'start',
                        height: '100%',
                    }}
                >
                    {params.value.length}
                </div>
            )
        },
        {
            field: 'status', headerName:t('routes.status'), type: 'singleSelect', width: 160,
            valueOptions: Object.values(RouteStatus),
            renderCell: (params) => {
                const cfg = statusConfig[params.row.status as RouteStatusValue];
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
                            {t(`routeStatus.${params.row.status}`)}
                        </span>
                    </div>
                );
            }
        },
        {
            field: 'actions',
            headerName: t('routes.actions'),
            width: 120,
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
                    <IconButton
                        color="default"
                        onClick={(event) => {
                            event.stopPropagation();
                            handlePrint(params.row);
                        }}
                    >
                        <Printer size={18}/>
                    </IconButton>
                </div>
            ),
        },
    ];

    const handlePrint = (row: OrderRow) => {
        if (row.id) {
            getRoute(row.id).then((data: ResponseDTO) => {
                setPrintRow({...data.route});
            }).finally(() => {
                setTimeout(() => {
                    const content = document.querySelector('.print-only')?.innerHTML ?? '';

                    if ((window as any).electronAPI) {
                        (window as any).electronAPI.sendToPrint(content);
                    } else {
                        globalThis.print();
                    }
                }, 150);
            });
        }
    };

    const handleUpdateRoute = (updated: OrderRow | Product | Customer | Driver | Route | Receipt | Supplier) => {
        setRows(prev => {
            const index = prev.findIndex(r => r.id === updated.id);

            if (index === -1) return prev;

            const newRows = [...prev];
            newRows[index] = { ...updated }; // IMPORTANT spread

            return newRows;
        });
        incrementRefreshKey();
    };

    const handleDeleteRoute = (id: number) => {
        setRows(prev => prev.filter(row => row.id !== id));
        incrementRefreshKey();
    };

    useEffect(() => {
        setLoading(true);
        searchRoutes({
            page: paginationModel.page,
            pageSize: paginationModel.pageSize,
            globalSearch: isSearching ? searchName : "",
            sortBy: sortModel[0]?.field,
            sortDirection: sortModel[0]?.sort ?? "asc",
            filters: filterModel.items ?? []
        }).then(data => {
                const routes: Route[] = [];
                data.content.forEach(route => {
                    routes.push({
                        id: route.id,
                        name: route.name,
                        date: route.date ? dayjs(route.date).toDate() : undefined,
                        orders: route.orders,
                        driver: route.driver,
                        notes: route.notes,
                        status: route.status
                    });
                });
                setRows(routes);
                setRowCount(data.totalElements);
            })
            .catch(() => console.log("error fetching routes"))
            .finally(() => setLoading(false));
    }, [paginationModel, isSearching, searchName, sortModel, filterModel, refreshKey])

    return (
        <>
            <MyTable
                columns={columns}
                typeOf={"Routes"}
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
                typeOf={"Routes"}
                setSubmitted={setSubmitted}
                handleUpdate={handleUpdateRoute}
            />
            <PopUpDelete
                setRowToEdit={setRowToEdit}
                open={openDeletePopUp}
                rowToEdit={onDeleteContent}
                typeOf={"Routes"}
                setOpen={setOpenDeletePopUp}
                handleDelete={handleDeleteRoute}
                setSubmitted={setSubmitted}
            />
            <div className="flex justify-center items-center mt-2 w-full mx-auto">
                {submitted && (
                    <PopUpItemOperation
                        setSubmitted={setSubmitted}
                        typeOf={"route"}
                        item={rowToEdit as OrderItem}
                        operation={operation}
                    />
                )}
            </div>
            {printRow && (
                <div className="print-only">
                    <PrintableTable route={printRow} />
                </div>
            )}
        </>

    )

}

export default RoutesView;