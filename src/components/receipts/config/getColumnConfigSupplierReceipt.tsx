import type {GridColDef} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import type {Payment, Receipt, ResponseDTO} from "../../../types/Types.ts";
import {getPayment} from "../../../services/paymentService.ts";
import {formatCurrency} from "../../../helper/currencyHelper.ts";

interface ColumnConfigCustomerReceiptProps {
    setOnDeleteContent: React.Dispatch<React.SetStateAction<Receipt | Payment | undefined>>;
    setOperation: React.Dispatch<React.SetStateAction<string>>;
    setOpenDeletePopUp: React.Dispatch<React.SetStateAction<boolean>>;
    currency: string;
    locale: string;
}

const getColumnConfigSupplierReceipt = ({
                                            setOnDeleteContent,
                                            setOperation,
                                            setOpenDeletePopUp,
                                            currency,
                                            locale
                                        }: ColumnConfigCustomerReceiptProps, t: any) => {

    const handleOnDelete = (row: Receipt) =>{
        if (row.id) getPayment(row.id).then((data: ResponseDTO)=> {
            setOnDeleteContent({...data.payment});
            setOperation("deleted");
        }).finally(()=>setOpenDeletePopUp(true));
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: t('receipts.table.id'), width: 20, renderCell: (params) => (
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
        { field: 'supplier', headerName: t('receipts.table.supplier'), width: 200,
            valueGetter: (_, row) => row.supplier?.name ?? '' ,
            renderCell: (params) => (
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
        { field: 'amount', headerName: t('receipts.table.amount'), width: 80, type: "number", renderCell: (params) => (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'end',
                        height: '100%',
                    }}
                >
                    {formatCurrency(params.value, currency, locale)}
                </div>
            ) },
        {field: 'date', headerName: t('receipts.table.date'), type: 'date', width: 80, renderCell: (params) => (
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
            field: 'actions',
            headerName: t('receipts.table.actions'),
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

    return columns;

}

export default getColumnConfigSupplierReceipt;