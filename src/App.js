import "./App.scss";
import "./assets/styles/_variables.scss";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import AuthenticationContext from "./contexts/Authentication.context";
import useAuthentication from "./hooks/useAuthentication";
import Products from "./pages/Products";
import useCategories from "./hooks/useCategories";
import CategoriesContext from "./contexts/Categories.context";
import FaqPage from "./pages/FaqPage";
// import Profile from './Pages/Profile/profile';
// import Categories from './Pages/Categories/categories';

function App() {
  const {
    isAuthenticated,
    nameUser,
    lastNameUser,
    emailUser,
    getInitials,
    writeAccesToken,
    writeRefreshToken,
    getCookie,
    checkAuthenticate,
    logOut,
  } = useAuthentication();
  const {
    allCategories,
    allCategoriesSelectType,
    checkCategories,
    clearCategories,
  } = useCategories();

  return (
    <>
      <CategoriesContext.Provider
        value={{
          allCategories,
          allCategoriesSelectType,
          checkCategories,
          clearCategories,
        }}
      >
        <AuthenticationContext.Provider
          value={{
            isAuthenticated,
            nameUser,
            lastNameUser,
            emailUser,
            getInitials,
            writeAccesToken,
            writeRefreshToken,
            checkAuthenticate,
            getCookie,
            logOut,
          }}
        >
          <Header />

          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="registration" element={<Registration />} />
            <Route path="products" element={<Products />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="" element={<Login />} />
            {/* <Route path="categories/*" element={<Categories/>}/> */}
            {/* <Route path=":name" element={<Profile/>}/> */}
          </Routes>

          <Footer />
        </AuthenticationContext.Provider>
      </CategoriesContext.Provider>
    </>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
