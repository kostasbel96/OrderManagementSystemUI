import {Paper} from "@mui/material";
import {DataGrid, type GridColDef} from '@mui/x-data-grid';
import Search from "../Search.tsx";
import {useState} from "react";
import type {Product} from "../../types/Types.ts";
import {getProducts} from "../../services/productService.ts";

const ProductsTable = () => {
    const [rows, setRows] = useState<Product[]>(getProducts());

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 120 },
        { field: 'name', headerName: 'Product name', width: 300 },
        { field: 'description', headerName: 'Description', width: 300 },
        {field: 'quantity', headerName: 'Quantity', width: 130 }
    ];


    const paginationModel = { page: 0, pageSize: 10 };

    return (
        <>
            <div className="w-full mt-5 flex flex-col space-y-2 justify-center items-center px-4">
                <Search type={"Products"} setRows={setRows}/>
                <Paper sx={{
                    height: '80%',
                    width: '100%',
                    maxWidth: 900,
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
    )

}

export default ProductsTable;