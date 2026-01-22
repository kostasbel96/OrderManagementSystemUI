import {DataGrid, type GridColDef} from "@mui/x-data-grid";
import type {Customer, Product} from "../../types/Types.ts";
import Search from "../Search.tsx";
import {Paper} from "@mui/material";

type TableProps = {
    columns: GridColDef[];
    typeOf: string;
    setRows: React.Dispatch<React.SetStateAction<(Product | Customer)[]>>;
    rows: (Product | Customer)[];
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
                    maxWidth: 950,
                    marginBottom: 2
                }}
                >
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        sx={{ border: 0 }}
                    />
                </Paper>
            </div>
        </>
    );
}

export default MyTable;