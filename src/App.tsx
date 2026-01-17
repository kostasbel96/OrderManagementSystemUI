import './App.css'
import Layout from "./components/Layout.tsx";
import {BrowserRouter, Route, Routes} from "react-router";
import Content from "./components/Content.tsx";
import ProductsTable from "./components/products/ProductsTable.tsx";
import Main from "./components/Main.tsx";
import OrdersTable from "./components/orders/OrdersTable.tsx";
import CustomersTable from "./components/customers/CustomersTable.tsx";


function App() {

  return (
    <>
      <BrowserRouter>
          <Routes>
              <Route element={<Layout/>}>
                  <Route element={<Main/>}>
                      <Route path="products" element={<ProductsTable/>}/>
                      <Route path="orders" element={<OrdersTable/>}/>
                      <Route path="customers" element={<CustomersTable/>}/>
                      <Route index element={<Content/>}/>
                  </Route>
              </Route>
          </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
