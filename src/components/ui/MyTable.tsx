import {
    DataGrid,
    type GridColDef,
    type GridFilterModel, type GridPaginationModel,
    type GridRowSelectionModel,
    type GridSortModel
} from "@mui/x-data-grid";
import type {Customer, OrderRow, Product} from "../../types/Types.ts";
import Search from "../Search.tsx";
import {Paper} from "@mui/material";
import {useUIStore} from "../../hooks/store/useUIStore.ts";
import React from "react";

type TableProps = {
    columns: GridColDef[];
    typeOf: string;
    rows: (Product | Customer | OrderRow)[];
    loading: boolean;
    rowCount: number;
    paginationModel: GridPaginationModel;
    setPaginationModel: React.Dispatch<React.SetStateAction<GridPaginationModel>>;
    setSearchName: React.Dispatch<React.SetStateAction<string>>;
    setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
    setSortModel: React.Dispatch<React.SetStateAction<GridSortModel>>;
    sortModel: GridSortModel;
    filterModel: GridFilterModel;
    setFilterModel: React.Dispatch<React.SetStateAction<GridFilterModel>>;
    columnVisibility?: Record<string, boolean>;
    setColumnVisibility?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    selectionModel?: GridRowSelectionModel;
    setSelectionModel?: React.Dispatch<
        React.SetStateAction<GridRowSelectionModel>
    >;
    selection?: boolean;
    height?: string;
    width?: number;
}


const MyTable = ({columns,
                      typeOf,
                      rows,
                      setSortModel,
                      sortModel,
                      paginationModel,
                      setPaginationModel,
                      loading,
                      rowCount,
                      setSearchName,
                      setIsSearching,
                      filterModel,
                      setFilterModel,
                      columnVisibility,
                      setColumnVisibility,
                      selectionModel,
                      setSelectionModel,
                      selection,
                     height,
                     width}: TableProps)=>{

    const collapsed = useUIStore((s) => s.sidebarCollapsed);
    return (
        <div className="mt-5 flex flex-col space-y-2 justify-center items-center px-4">
            <Search
                typeOf={typeOf}
                setIsSearching={setIsSearching}
                setSearchName={setSearchName}
                setPaginationModel={setPaginationModel}
            />
            <Paper sx={{
                maxHeight: height ?? "calc(100vh - 200px)",
                maxWidth: collapsed ? 1650 : 1200 - (width ?? 0),
                transition: "max-width 0.3s ease",
                width: "100%",
                marginBottom: 2,
                display: 'flex',
                flexDirection: 'column'
            }}
            >
                <DataGrid
                    rows={rows}
                    isRowSelectable={() => !loading}
                    columns={columns}
                    getRowId={(row) => Number(row.id)}
                    rowCount={rowCount}
                    loading={loading}

                    rowSelectionModel={selectionModel}
                    onRowSelectionModelChange={(newModel: GridRowSelectionModel) => {
                        setSelectionModel?.(newModel)}}

                    filterMode="server"
                    filterModel={filterModel}
                    onFilterModelChange={(model) => setFilterModel(model)}

                    paginationMode="server"
                    sortingMode="server"

                    sortModel={sortModel}
                    onSortModelChange={(model) => setSortModel(model)}

                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}

                    columnVisibilityModel={columnVisibility}
                    onColumnVisibilityModelChange={setColumnVisibility}

                    pageSizeOptions={[5, 10, 20, 50, 100]}
                    checkboxSelection={selection}
                    disableRowSelectionOnClick
                    // keepNonExistentRowsSelected

                    density="compact"

                    sx={{
                        height: '100%',
                        border: 0,
                        fontSize: '0.7rem',
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f9fafb',
                            borderBottom: '1px solid #e5e7eb',
                            fontWeight: 600,
                        },
                        '& .MuiDataGrid-cell': {
                            alignItems: 'flex-start',
                            lineHeight: '1rem',
                            borderBottom: '1px solid #f1f5f9',
                        },
                        "& .MuiDataGrid-cellCheckbox, & .MuiDataGrid-columnHeaderCheckbox": {
                            justifyContent: "center",
                            alignItems: "center",
                        },
                    }}
                />
            </Paper>
        </div>
    );
}

export default MyTable;