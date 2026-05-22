import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { ClipboardList } from 'lucide-react';
import OrdersView from '../orders/OrdersView.tsx';
import {useTranslation} from "react-i18next";

export function RecentOrders() {
    const { t } = useTranslation();
    return (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>

            <CardHeader
                avatar={<ClipboardList size={16} color="var(--mui-palette-text-secondary)" aria-hidden />}
                title={
                    <Typography variant="body2" fontWeight={500}>
                        {t('dashboard.recentOrders')}
                    </Typography>
                }
                sx={{ pb: 0 }}
            />

            <CardContent sx={{ pt: 1, pb: '12px !important' }}>
                <OrdersView
                    orderType="orderCustomer"
                    height={"35vh"}
                    showSearchBar={false}
                />
            </CardContent>

        </Card>
    );
}