import type {Route} from "../../types/Types.ts";
import {useUIStore} from "../../hooks/store/useUIStore.ts";
import {formatCurrency} from "../../helper/currencyHelper.ts";
import {useTranslation} from "react-i18next";

const tdStyle: React.CSSProperties = {
    outline: '1px solid #000000',
    padding: '8px',
    textAlign: 'left',
    verticalAlign: 'top',
    color: '#000000',
    wordBreak: 'normal',
    overflowWrap: 'break-word',
};

const thStyle: React.CSSProperties = {
    ...tdStyle,
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
};


const PrintableTable = ({ route }: { route: Route }) => {
    const {locale, currency} = useUIStore();
    const { t } = useTranslation();

    return (
        <table
            className="print-only-table"
            style={{width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'Arial, sans-serif'}}
        >
            <thead>
            <tr>
                <th style={{...thStyle, width: '18%'}}>{t('typeNames.customer')}</th>
                <th style={{...thStyle, width: '35%'}}>{t('nav.products')}</th>
                <th style={{...thStyle, width: '25%'}}>{t('customer.address')}</th>
                <th style={{...thStyle, width: '12%', textAlign: 'right'}}>{t('print.phone')}</th>
                <th style={{...thStyle, width: '10%', textAlign: 'right'}}>{t('customers.table.balance')}</th>
            </tr>
            </thead>
            <tbody>
            {route.orders.map(order => (
                <tr key={order.id}>
                    <td style={tdStyle}>{`${order.customer?.name} ${order.customer?.lastName}`}</td>
                    <td style={{...tdStyle, whiteSpace: 'pre-line'}}>
                        {order.items.map(i => `${i.product?.name} (${i.quantity})`).join('\n')}
                    </td>
                    <td style={tdStyle}>{order.address}</td>
                    <td style={{...tdStyle, textAlign: 'right'}}>
                        {[order.customer?.phoneNumber1, order.customer?.phoneNumber2]
                            .filter(Boolean)
                            .join(', ')}
                    </td>
                    <td style={{...tdStyle, textAlign: 'right'}}>
                        {formatCurrency(Number(order.customer?.balance ?? 0), currency, locale)}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default PrintableTable;