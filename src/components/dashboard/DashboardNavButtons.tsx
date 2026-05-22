import Button from '@mui/material/Button';
import MuiBox from '@mui/material/Box';  // ← rename για να αποφύγεις conflict
import {ShoppingCart, Package, Users, Box, PlusIcon, Truck} from 'lucide-react';
import { useTabs } from '../../contexts/TabContext.tsx';
import OrdersView from '../orders/OrdersView.tsx';
import SuppliersView from '../suppliers/SuppliersView.tsx';
import CustomersView from '../customers/CustomersView.tsx';
import ProductsView from '../products/ProductsView.tsx';
import QuickAdd from '../QuickAdd.tsx';
import { useTranslation } from 'react-i18next';
import RoutesView from "../routes/RoutesView.tsx";

const navItems = [
    { id: 'add',       label: 'nav.quickAdd',        icon: PlusIcon,     component: <QuickAdd />      },
    { id: 'orders',    label: 'nav.customerOrders', icon: ShoppingCart, component: <OrdersView />    },
    { id: 'suppliers', label: 'nav.suppliers',       icon: Package,      component: <SuppliersView /> },
    { id: 'customers', label: 'nav.customers',       icon: Users,        component: <CustomersView /> },
    { id: 'products',  label: 'nav.products',        icon: Box,          component: <ProductsView />  },
    { id: 'routes',       label: 'nav.routes',        icon: Truck,     component: <RoutesView />      }
];

export function DashboardNavButtons() {
    const { addTab } = useTabs();
    const { t } = useTranslation();

    return (
        <MuiBox sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0.5, marginRight: 1 }}>
            {navItems.map(({ id, label, icon: Icon, component }) => (
                <Button
                    key={id}
                    variant="outlined"
                    size="small"
                    startIcon={<Icon size={14} />}
                    onClick={() => addTab({ id, label: t(label), path: `/${id}`, component })}
                    sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
                >
                    {t(label)}
                </Button>
            ))}
        </MuiBox>
    );
}