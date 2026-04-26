import './App.css'
import Layout from "./components/Layout.tsx";
import {HashRouter, Route, Routes} from "react-router";
import QuickAdd from "./components/QuickAdd.tsx";
import ProductsView from "./components/products/ProductsView.tsx";
import OrdersView from "./components/orders/OrdersView.tsx";
import CustomersView from "./components/customers/CustomersView.tsx";
import Dashboard from "./components/Dashboard.tsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function App() {


    const theme = createTheme({
        typography: {
            fontFamily: "Inter, Roboto, Arial, sans-serif",
            fontSize: 12
        },
        components: {
            MuiInputBase: {
                styleOverrides: {
                    input: {
                        fontFamily: "inherit",
                    },
                },
            },
        },
    });

    return (
      <ThemeProvider theme={theme}>
          <HashRouter>
              <Routes>
                  <Route element={<Layout/>}>
                      <Route path="products" element={<ProductsView/>}/>
                      <Route path="orders" element={<OrdersView selection={false}/>}/>
                      <Route path="customers" element={<CustomersView/>}/>
                      <Route path="add" element={<QuickAdd/>}/>
                      <Route index element={<Dashboard/>}/>
                  </Route>
              </Routes>
          </HashRouter>
      </ThemeProvider>
  )
}

export default App
