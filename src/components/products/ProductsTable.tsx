import {Paper} from "@mui/material";
import {DataGrid, type GridColDef} from '@mui/x-data-grid';
import {products} from "../../services/productService.ts";

const ProductsTable = () => {
    const rows = products;

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Product name', width: 200 },
        { field: 'description', headerName: 'Description', width: 200 },
        {field: 'quantity', headerName: 'Quantity', width: 80 }
    ];

    const paginationModel = { page: 0, pageSize: 5 };

    return (
        <>
            <div className="w-full mt-5 flex justify-center items-center px-4">
                <Paper sx={{
                    height: 400,
                    width: '100%',
                    maxWidth: 900,
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