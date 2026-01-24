import './App.css'
import Layout from "./components/Layout.tsx";
import {BrowserRouter, Route, Routes} from "react-router";
import Content from "./components/Content.tsx";
import ProductsView from "./components/products/ProductsView.tsx";
import Main from "./components/Main.tsx";
import OrdersView from "./components/orders/OrdersView.tsx";
import CustomersView from "./components/customers/CustomersView.tsx";


function App() {

  return (
    <>
      <BrowserRouter>
          <Routes>
              <Route element={<Layout/>}>
                  <Route element={<Main/>}>
                      <Route path="products" element={<ProductsView/>}/>
                      <Route path="orders" element={<OrdersView/>}/>
                      <Route path="customers" element={<CustomersView/>}/>
                      <Route index element={<Content/>}/>
                  </Route>
              </Route>
          </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
