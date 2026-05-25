import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Layers } from 'lucide-react';
import {useEffect, useState} from "react";
import {getStockLevels} from "../../services/dashboardService.ts";
import type {StockItem} from "../../types/Types.ts";
import {TextField} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useUIStore} from "../../hooks/store/useUIStore.ts";

function getBarColor(pct: number): string {
    if (pct <= 10) return '#c0392b';   // bar-low
    if (pct <= 20) return '#d48a10';   // bar-warn
    return '#3d9a6c';                  // bar-ok
}

export function StockLevels() {
    const [stocks, setStocks] = useState<StockItem[]>([]);
    const [threshold, setThreshold] = useState<number>(30);
    const { t } = useTranslation();
    const refreshKey = useUIStore((s) => s.refreshKey);


    useEffect(() => {
        getStockLevels(threshold).then((data) => {
            setStocks(data);
        }).catch((err) => {
            console.log(err);
        });
    }, [threshold, refreshKey]);

    return (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>

            <CardHeader
                avatar={<Layers size={16} color="var(--mui-palette-text-secondary)" aria-hidden />}
                title={
                    <Typography variant="body2" fontWeight={500}>
                        {t('dashboard.stockLevels')}
                    </Typography>
                }
                action={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            ≤
                        </Typography>

                        <TextField
                            size="small"
                            type="number"
                            defaultValue={threshold}
                            onChange={(e)=> setThreshold(Number(e.target.value))}
                            inputProps={{min: 0}}
                            sx={{
                                width: 70,
                                '& input': {
                                    fontSize: 12,
                                    padding: '6px 8px',
                                }
                            }}
                        />
                    </Box>
                }
                sx={{ pb: 0 }}
            />

            <CardContent sx={{ pt: 1, pb: '12px !important' }}>
                <Box sx={{
                    maxHeight: 130,
                    overflowY: 'auto',
                    pr: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    '&::-webkit-scrollbar':       { width: 4 },
                    '&::-webkit-scrollbar-track':  { bgcolor: 'action.hover', borderRadius: 99 },
                    '&::-webkit-scrollbar-thumb':  { bgcolor: 'divider',      borderRadius: 99 },
                }}>
                    {stocks.map((item) => (
                        <Box key={item.productName}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '4px' }}>
                                <Typography variant="caption" fontWeight={500} color="text.primary">
                                    {item.productName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {item.quantity} {t('dashboard.units')}
                                </Typography>
                            </Box>
                            <Box sx={{ height: 5, bgcolor: 'action.hover', borderRadius: 99, overflow: 'hidden' }}>
                                <Box sx={{
                                    height: '100%',
                                    width: `${item.pct}%`,
                                    bgcolor: getBarColor(item.pct),
                                    borderRadius: 99,
                                    transition: 'width 0.4s ease',
                                }} />
                            </Box>
                        </Box>
                    ))}
                </Box>
            </CardContent>

        </Card>
    );
}