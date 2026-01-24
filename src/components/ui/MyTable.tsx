import {DataGrid, type GridColDef} from "@mui/x-data-grid";
import type {Customer, OrderRow, Product} from "../../types/Types.ts";
import Search from "../Search.tsx";
import {Paper} from "@mui/material";



type TableProps = {
    columns: GridColDef[];
    typeOf: string;
    setRows: React.Dispatch<React.SetStateAction<(Product | Customer | OrderRow)[]>>;
    rows: (Product | Customer | OrderRow)[];
}


const MyTable = ({columns, typeOf, setRows, rows}: TableProps)=>{

    const paginationModel = { page: 0, pageSize: 10 };

    return (
        <>
            <div className="w-full mt-5 flex flex-col space-y-2 justify-center items-center px-4">
                <Search typeOf={typeOf} setRows={setRows}/>
                <Paper sx={{
                    height: '80%',
                    width: '100%',
                    maxWidth: 1100,
                    marginBottom: 2
                }}
                >
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        getRowHeight={() => "auto"}
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
        </>
    );
}

export default MyTable;