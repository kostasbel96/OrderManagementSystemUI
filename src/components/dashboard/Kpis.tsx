import Grid from "@mui/material/Grid";
import {KpiCard} from "./KpiCard.tsx";
import {AlertTriangle, Package, ShoppingCartIcon, Users} from "lucide-react";
import type {KpiCardResponse, KpiCardType} from "../../types/Types.ts";
import {useEffect, useState} from "react";
import {getKpiCard} from "../../services/dashboardService.ts";
import {useTranslation} from "react-i18next";
import {useUIStore} from "../../hooks/store/useUIStore.ts";

export const Kpis = () => {
    const [kpiCard, setKpiCard] = useState<KpiCardResponse | null>(null);
    const { lowStockThreshold } = useUIStore();
    const { t } = useTranslation();
    const refreshKey = useUIStore((s) => s.refreshKey);

    const getValue = (value: number) => {
        return (value > 0) ? `+${value}` : value;
    }

    useEffect(() => {
        getKpiCard(lowStockThreshold)
            .then(setKpiCard)
            .catch(console.error);
    }, [lowStockThreshold, refreshKey]);

    if (!kpiCard) return null;

    const kpis: KpiCardType[] = [
        {
            label: t('kpi.totalProducts'),
            value: kpiCard.productKpi.totalProducts.toLocaleString(),
            delta: t('kpi.totalProductsDelta', { delta: `${getValue(kpiCard.productKpi.deltaPercentage)}` }),
            deltaPositive: kpiCard.productKpi.deltaPercentage >= 0,
            icon: Package,
        },
        {
            label: t('kpi.totalOrders'),
            value: kpiCard.orderKpi.totalOrdersByDate.toLocaleString(),
            delta: t('kpi.totalOrdersDelta', { delta: `${getValue(kpiCard.orderKpi.deltaOrdersByYesterday)}` }),
            deltaPositive: kpiCard.orderKpi.deltaOrdersByYesterday >= 0,
            icon: ShoppingCartIcon
        },
        {
            label: t('kpi.lowStock'),
            value: String(kpiCard.productKpi.productLowStock),
            delta: t('kpi.lowStockDelta', { delta: `${getValue(kpiCard.productKpi.deltaLowStockByYesterday)}` }),
            deltaPositive: false,
            icon: AlertTriangle,
        },
        {
            label: t('kpi.totalCustomers'),
            value: kpiCard.customerKpi.totalCustomers.toLocaleString(),
            delta: t('kpi.totalCustomersDelta', { delta: `${getValue(kpiCard.customerKpi.deltaCustomersByYesterday)}` }),
            deltaPositive: kpiCard.customerKpi.deltaCustomersByYesterday >= 0,
            icon: Users,
        }
    ];

    return (
        <>
            {kpis.map((kpi: KpiCardType) => (
                <Grid key={kpi.label} size={{ xs: 12, sm: 6, md: 3 }}>
                    <KpiCard {...kpi} />
                </Grid>
            ))}
        </>

    )

}

export default Kpis;