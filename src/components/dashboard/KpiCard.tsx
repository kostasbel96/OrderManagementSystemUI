import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

interface KpiCardProps {
    label: string;
    value: string;
    delta: string;
    deltaPositive: boolean;
    icon: LucideIcon;
}

export function KpiCard({ label, value, delta, deltaPositive, icon: Icon }: Readonly<KpiCardProps>) {
    return (
        <Box sx={{
            bgcolor: 'white',
            borderRadius: 2,
            p: '14px 16px',
            position: 'relative',
            overflow: 'hidden',
        }}>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', mb: '6px' }}>
                <Icon size={14} color="var(--mui-palette-text-secondary)" aria-hidden />
                <Typography variant="caption" sx={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: 'text.secondary',
                }}>
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