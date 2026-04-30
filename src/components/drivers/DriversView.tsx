import type {GridColDef, GridFilterModel, GridPaginationModel, GridSortModel} from "@mui/x-data-grid";
import MyTable from "../ui/MyTable.tsx";
import {useEffect, useState} from "react";
import type {Customer, Driver, OrderItem, OrderRow, Product} from "../../types/Types.ts";
import {searchDrivers} from "../../services/driverService.ts";
import IconButton from "@mui/material/IconButton";
import {EditIcon} from "lucide-react";
import PopUpUpdate from "../ui/PopUpUpdate.tsx";
import DeleteIcon from "@mui/icons-material/Delete";
import PopUpDelete from "../ui/PopUpDelete.tsx";
import PopUpItemOperation from "../ui/popup/PopUpItemOperation.tsx";

const DriversView = () => {

    const [rows, setRows] = useState<(Product | Driver | OrderRow | Customer)[]>([]);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({page: 0, pageSize: 10})
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [rowToEdit, setRowToEdit] = useState<OrderItem | Driver | Product | Customer | undefined>();
    const [openDeletePopUp, setOpenDeletePopUp] = useState(false);
    const [onDeleteContent, setOnDeleteContent] = useState<Driver>();
    const [submitted, setSubmitted] = useState(false);
    const [operation, setOperation] = useState("");
    const [searchName, setSearchName] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [sortModel, setSortModel] = useState<GridSortModel>([{field: "name", sort: "asc"}]);
    const [filterModel, setFilterModel] = useState<GridFilterModel>({
        items: []
    });

    const handleClickOpen = (row: Driver) => {
        setOpenEdit(true);
        setRowToEdit(row);
        setOperation("updated");
    };

    const handleOnDelete = (row: Driver) =>{
        setOpenDeletePopUp(true);
        setOnDeleteContent(row);
        setOperation("deleted");
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
            )  },
        { field: 'name', headerName: 'Name', width: 150, renderCell: (params) => (
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
        { field: 'lastName', headerName: 'Last Name', width: 150, renderCell: (params) => (
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
        {field: 'phoneNumber1', headerName: 'Phone Number 1', width: 150, renderCell: (params) => (
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
        {field: 'phoneNumber2', headerName: 'Phone Number 2', width: 150, renderCell: (params) => (
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

    const handleUpdateDriver = (updated: Product | Driver | OrderRow) => {
        setRows(prev => {
            const index = prev.findIndex(r => r.id === updated.id);

            if (index === -1) return prev;

            const newRows = [...prev];
            newRows[index] = { ...updated }; // IMPORTANT spread

            return newRows;
        });
    };

    const handleDeleteDriver = (id: number) => {
        setRows(prev => prev.filter(row => row.id !== id));
    };

    useEffect(() => {
        setLoading(true);
        searchDrivers({
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
    }, [paginationModel, searchName, isSearching, sortModel, filterModel]);


    return (
        <>
            <MyTable
                columns={columns}
                typeOf={"Drivers"}
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
                handleUpdate={handleUpdateDriver}
                open={openEdit}
                setOpen={setOpenEdit}
                rowToEdit={rowToEdit}
                typeOf={"Drivers"}
                setSubmitted={setSubmitted}
            />
            <PopUpDelete
                handleDelete={handleDeleteDriver}
                setRowToEdit={setRowToEdit}
                open={openDeletePopUp}
                rowToEdit={onDeleteContent}
                typeOf={"Drivers"}
                setOpen={setOpenDeletePopUp}
                setSubmitted={setSubmitted}
            />
            <div className="flex justify-center items-center mt-2 w-full mx-auto">
                {submitted && (
                    <PopUpItemOperation
                        setSubmitted={setSubmitted}
                        typeOf={"driver"}
                        item={rowToEdit as Driver}
                        operation={operation}
                    />
                )}
            </div>
        </>

    );

}

export default DriversView;