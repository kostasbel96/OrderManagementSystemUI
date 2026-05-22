import Grid from '@mui/material/Grid';
import { Package, Truck, AlertTriangle, CheckCheck } from 'lucide-react';
import { KpiCard } from './KpiCard.tsx';
import { StockLevels } from './StockLevels.tsx';
import { RecentOrders } from './RecentOrders.tsx';
import { Box } from '@mui/material';
import { DashboardNavButtons } from './DashboardNavButtons.tsx';

const kpis = [
    { label: 'Συνολικά είδη',        value: '4.812', delta: '+3.2% από χθες', deltaPositive: true,  icon: Package      },
    { label: 'Παραγγελίες σήμερα',   value: '148',   delta: '+12 από χθες',   deltaPositive: true,  icon: Truck        },
    { label: 'Χαμηλό απόθεμα',       value: '23',    delta: '+5 νέα σήμερα',  deltaPositive: false, icon: AlertTriangle },
    { label: 'Παραδόσεις σήμερα',    value: '97',    delta: '+8 από χθες',    deltaPositive: true,  icon: CheckCheck   },
];

export default function Dashboard() {
    return (
        <Grid container spacing={1.5}>

            {kpis.map((kpi) => (
                <Grid key={kpi.label} size={{ xs: 12, sm: 6, md: 3 }}>
                    <KpiCard {...kpi} />
                </Grid>
            ))}

            <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Box sx={{ flex: 1 }}>
                        <StockLevels />
                    </Box>
                    <Box>
                        <DashboardNavButtons />
                    </Box>
                </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
                <RecentOrders />
            </Grid>

        </Grid>
    );
}