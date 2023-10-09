import Header from "./components/Header";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import {Outlet} from "react-router-dom";

const Layout = ({search, setSearch}) => {
  return (
    <div className="App">
      <Header title={"My React Blog Page"} />
      <Nav search={search} setSearch={setSearch} />
      <Outlet/> {/* The nested routes will be rendered here */}
      <Footer />
    </div>
  )
}

export default Layout