import {DataGrid, type GridColDef, type GridSortModel} from "@mui/x-data-grid";
import type {Customer, OrderRow, Product} from "../../types/Types.ts";
import Search from "../Search.tsx";
import {Paper} from "@mui/material";

type TableProps = {
    columns: GridColDef[];
    typeOf: string;
    rows: (Product | Customer | OrderRow)[];
    loading: boolean;
    rowCount: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    page: number;
    pageSize: number;
    setSearchName: React.Dispatch<React.SetStateAction<string>>;
    setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
    setSortModel: React.Dispatch<React.SetStateAction<GridSortModel>>;
    sortModel: GridSortModel;
}


const MyTable = ({columns, typeOf, rows, setSortModel, sortModel, loading, rowCount, setPage, setPageSize, page, pageSize, setSearchName, setIsSearching}: TableProps)=>{

    return (
            <div className="w-full mt-5 flex flex-col space-y-2 justify-center items-center px-4">
                <Search
                    typeOf={typeOf}
                    setIsSearching={setIsSearching}
                    setSearchName={setSearchName}
                    setPage={setPage}
                />
                <Paper sx={{
                    height: '80%',
                    width: '100%',
                    maxWidth: 1100,
                    marginBottom: 2
                }}
                >
                    <DataGrid
                        getRowHeight={() => 'auto'}
                        rows={rows}
                        columns={columns}
                        getRowId={(row) => row.id}
                        rowCount={rowCount}
                        loading={loading}
                        paginationMode="server"
                        sortingMode="server"
                        sortModel={sortModel}
                        onSortModelChange={(model) => {
                            setSortModel(model);
                        }}
                        paginationModel={{ page, pageSize }}
                        onPaginationModelChange={(model) => {
                            setPage(model.page);
                            setPageSize(model.pageSize);
                        }}
                        pageSizeOptions={[5, 10, 20, 50, 100]}
                        keepNonExistentRowsSelected
                        checkboxSelection
                        sx={{
                            border: 0,
                            '& .MuiDataGrid-cell': {
                                alignItems: 'flex-start',
                                paddingTop: '8px',
                                paddingBottom: '8px',
                            },
                            "& .MuiDataGrid-cellCheckbox, & .MuiDataGrid-columnHeaderCheckbox": {
                                justifyContent: "start",  // οριζόντια
                                alignItems: "center",      // κάθετα
                            }
                        }}
                    />
                </Paper>
            </div>
    );
}

export default MyTable;