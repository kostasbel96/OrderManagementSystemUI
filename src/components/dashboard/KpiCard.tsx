import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TrendingUp, TrendingDown} from 'lucide-react';
import type {KpiCardType} from "../../types/Types.ts";
import ProductsView from "../products/ProductsView.tsx";
import {useTabs} from "../../contexts/TabContext.tsx";
import CustomersView from "../customers/CustomersView.tsx";
import OrdersView from "../orders/OrdersView.tsx";
import RoutesView from "../routes/RoutesView.tsx";
import dayjs from "dayjs";
import {useUIStore} from "../../hooks/store/useUIStore.ts";

export function KpiCard({id, label, value, delta, deltaPositive, icon: Icon }: Readonly<KpiCardType>) {

    const { addTab } = useTabs();
    const { lowStockThreshold } = useUIStore();

    const tabRegistry: Record<string, () => React.ReactNode> = {
        productsView: () => <ProductsView />,
        ordersToday: () => <OrdersView filters={{
            items: [
                {
                    field: "date",
                    operator: "is",
                    value: dayjs().startOf('day').toISOString(),
                },
            ],
        }}/>,
        totalCustomers: () => <CustomersView />,
        routesToday: () => <RoutesView filters={{
            items: [
                {
                    field: "date",
                    operator: "is",
                    value: dayjs().startOf('day').toISOString(),
                },
            ],
        }}/>,
        productsLowStock: () => <ProductsView filters={{
                items: [
                    {
                        field: "quantity",
                        operator: "<=",
                        value: lowStockThreshold,
                    },
                ],
            }}/>
    };


    return (
        <Box sx={{
            bgcolor: 'white',
            borderRadius: 2,
            p: '14px 16px',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            border: "1px solid white",

            '&:hover': {
                bgcolor: '#f5f7ff',
                border: "1px solid #e5e7eb"
            },
        }}
             onClick={() => addTab({id, label, component: tabRegistry[id] ?? (() => null), path: "products"})}
        >

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', mb: '6px' }}>
                <Icon size={14} color="var(--mui-palette-text-secondary)" aria-hidden />
                <Typography variant="caption" sx={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: 'text.secondary',
                }}
                >
                    {label}
                </Typography>
            </Box>

            <Typography sx={{ fontSize: 26, fontWeight: 500, lineHeight: 1 }}>
                {value}
            </Typography>

            <Box sx={{
                display: 'flex', alignItems: 'center', gap: '3px',
                mt: '6px',
                color: deltaPositive ? 'success.main' : 'error.main',
            }}>
                {deltaPositive
                    ? <TrendingUp size={12} />
                    : <TrendingDown size={12} />
                }
                <Typography variant="caption" sx={{ color: 'inherit' }}>
                    {delta}
                </Typography>
            </Box>

            <Box sx={{
                position: 'absolute', right: 14, top: '50%',
                transform: 'translateY(-50%)', opacity: 0.08,
                display: 'flex',
            }}>
                <Icon size={28} aria-hidden />
            </Box>

        </Box>
    );
}