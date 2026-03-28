import './App.css'
import Layout from "./components/Layout.tsx";
import {BrowserRouter, Route, Routes} from "react-router";
import QuickAdd from "./components/QuickAdd.tsx";
import ProductsView from "./components/products/ProductsView.tsx";
import OrdersView from "./components/orders/OrdersView.tsx";
import CustomersView from "./components/customers/CustomersView.tsx";
import Dashboard from "./components/Dashboard.tsx";


function App() {

  return (
  <BrowserRouter>
      <Routes>
          <Route element={<Layout/>}>
                  <Route path="products" element={<ProductsView/>}/>
                  <Route path="orders" element={<OrdersView/>}/>
                  <Route path="customers" element={<CustomersView/>}/>
                  <Route path="add" element={<QuickAdd/>}/>
                  <Route index element={<Dashboard/>}/>
          </Route>
      </Routes>
  </BrowserRouter>
  )
}

export default App
