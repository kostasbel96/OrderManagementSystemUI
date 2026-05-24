import Grid from '@mui/material/Grid';
import { StockLevels } from './StockLevels.tsx';
import { RecentOrders } from './RecentOrders.tsx';
import { Box } from '@mui/material';
import { DashboardNavButtons } from './DashboardNavButtons.tsx';
import Kpis from "./Kpis.tsx";

export default function Dashboard() {
    return (
        <Grid container spacing={1.5}>
            <Kpis/>
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