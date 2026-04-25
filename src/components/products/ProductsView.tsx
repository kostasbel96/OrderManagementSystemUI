import {type GridColDef, type GridFilterModel, type GridSortModel} from '@mui/x-data-grid';
import {useEffect, useMemo, useState} from "react";
import type {Customer, OrderItem, OrderRow, Product} from "../../types/Types.ts";
import MyTable from "../ui/MyTable.tsx";
import { searchProducts } from "../../services/productService.ts";
import IconButton from "@mui/material/IconButton";
import {EditIcon} from "lucide-react";
import PopUpUpdate from "../ui/PopUpUpdate.tsx";
import DeleteIcon from '@mui/icons-material/Delete';
import PopUpDelete from "../ui/PopUpDelete.tsx";
import PopUpItemOperation from "../popup/PopUpItemOperation.tsx";

const ProductsView = () => {
    const [rows, setRows] = useState<(Product | Customer | OrderRow)[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [rowToEdit, setRowToEdit] = useState<Product | Customer | OrderItem | undefined>();
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
        { field: 'id', headerName: 'ID', width: 120, renderCell: (params) => (
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
        { field: 'name', headerName: 'Product name', width: 300, renderCell: (params) => (
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
        { field: 'description', headerName: 'Description', width: 300, renderCell: (params) => (
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
        {field: 'quantity', headerName: 'Quantity', type:"number", width: 100, renderCell: (params) => (
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
        {field: 'price', headerName: 'Price', width: 100, type:"number", renderCell: (params) => (
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
                    {params.value ? params.value + " €" : ""}
                </div>
            ) },
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
    ], []);

    useEffect(() => {
        setLoading(true);
        searchProducts({
            page,
            pageSize,
            globalSearch: isSearching ? searchName : "",
            sortBy: sortModel[0]?.field,
            sortDirection: sortModel[0]?.sort ?? "asc",
            filters: filterModel.items ?? []
        }).then((data) => {
                setRows(data.content);
                setRowCount(data.totalElements);
        }).finally(() => setLoading(false));
    }, [page, pageSize, searchName, isSearching, openEdit, openDeletePopUp, sortModel, filterModel]);

    return (
        <>
            <MyTable
                columns={columns}
                typeOf={"Products"}
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
                filterModel={filterModel}
                setFilterModel={setFilterModel}
            ></MyTable>
            <PopUpUpdate
                open={openEdit}
                rowToEdit={rowToEdit}
                typeOf={"Products"}
                setOpen={setOpenEdit}
                setSubmitted={setSubmitted}
            />
            <PopUpDelete
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