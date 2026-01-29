import {DataGrid, type GridColDef} from "@mui/x-data-grid";
import type {Customer, OrderRow, Product} from "../../types/Types.ts";
import Search from "../Search.tsx";
import {Box, CircularProgress, Paper} from "@mui/material";



type TableProps = {
    columns: GridColDef[];
    typeOf: string;
    setRows: React.Dispatch<React.SetStateAction<(Product | Customer | OrderRow)[]>>;
    rows: (Product | Customer | OrderRow)[];
    loading: boolean;
    rowCount: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    page: number;
    pageSize: number;
}


const MyTable = ({columns, typeOf, setRows, rows, loading, rowCount, setPage, setPageSize, page, pageSize}: TableProps)=>{


    return (
            <div className="w-full mt-5 flex flex-col space-y-2 justify-center items-center px-4">
                <Search typeOf={typeOf} setRows={setRows} page={page} pageSize={pageSize}/>
                <Paper sx={{
                    height: '80%',
                    width: '100%',
                    maxWidth: 1100,
                    marginBottom: 2
                }}
                >
                    {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress />
                            </Box>
                        ): (
                            <DataGrid
                                getRowHeight={() => 'auto'}
                                disableColumnSorting
                                disableColumnMenu
                                rows={rows}
                                columns={columns}
                                getRowId={(row) => row.id}
                                rowCount={rowCount}
                                loading={loading}
                                paginationMode="server"
                                sortingMode="client"
                                paginationModel={{ page, pageSize }}
                                onPaginationModelChange={(model) => {
                                    setPage(model.page);
                                    setPageSize(model.pageSize);
                                }}
                                pageSizeOptions={[5, 10, 20, 50, 100]}
                                checkboxSelection
                                sx={{
                                    border: 0,
                                    '& .MuiDataGrid-cell': {
                                        alignItems: 'center',
                                        paddingBottom: '8px',
                                    },
                                    "& .MuiDataGrid-cellCheckbox, & .MuiDataGrid-columnHeaderCheckbox": {
                                        justifyContent: "center",  // οριζόντια
                                        alignItems: "center",
                                        marginTop: '4px',
                                    }
                                }}
                            />
                        )
                    }
                </Paper>
            </div>
    );
}

export default MyTable;