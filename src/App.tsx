import './App.css'
import Layout from "./components/Layout.tsx";
import Banner from "./components/Banner.tsx";
import Main from "./components/Main.tsx";

function App() {

  return (
    <>
      <Layout>
          <Banner title="Order Management System"/>
          <Main/>
      </Layout>
    </>
  )
}

export default App
