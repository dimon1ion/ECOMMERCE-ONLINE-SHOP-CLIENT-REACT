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
import Product from "./pages/Product";
import useCart from "./hooks/useCart";
import CartContext from "./contexts/Cart.context";
import Profile from "./pages/Profile/Profile";
import ProfileDetails from "./pages/Profile/ProfileDetails/ProfileDetails";
import Cart from "./pages/Profile/Cart/Cart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificationContext from "./contexts/Notification.context";
import OrderPage from "./pages/OrderPage/OrderPage";
import History from "./pages/Profile/History/History";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  const {
    isAuthenticated,
    nameUser,
    lastNameUser,
    middleNameUser,
    emailUser,
    phoneNumberUser,
    getInitials,
    writeAccesToken,
    writeRefreshToken,
    getCookie,
    getToken,
    checkAuthenticate,
    logOut,
    reloadToken,
    deleteRefreshToken,
  } = useAuthentication();
  const { cart, countProducts, addToCart, findProductById, changeCountProductInCart, removeFromCart, initCart } = useCart(
    isAuthenticated,
    getToken,
    reloadToken
  );
  const {
    allCategories,
    allCategoriesSelectType,
    checkCategories,
    clearCategories,
    getCategoryById,
  } = useCategories();

  return (
    <>
      <NotificationContext.Provider
        value={{
          toastOptions: {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            rtl: false,
            pauseOnFocusLoss: true,
            draggable: true,
            pauseOnHover: true,
            theme: "colored",
          },
        }}
      >
        <AuthenticationContext.Provider
          value={{
            isAuthenticated,
            nameUser,
            lastNameUser,
            middleNameUser,
            emailUser,
            phoneNumberUser,
            getInitials,
            writeAccesToken,
            writeRefreshToken,
            checkAuthenticate,
            getCookie,
            getToken,
            logOut,
            reloadToken,
            deleteRefreshToken,
          }}
        >
          {isAuthenticated !== undefined && (
            <CategoriesContext.Provider
              value={{
                allCategories,
                allCategoriesSelectType,
                checkCategories,
                clearCategories,
                getCategoryById,
              }}
            >
              <CartContext.Provider
                value={{
                  cart,
                  countProducts,
                  addToCart,
                  findProductById,
                  changeCountProductInCart,
                  removeFromCart,
                  initCart
                }}
              >
                <Header />

                <Routes>
                  <Route path="login" element={<Login />} />
                  <Route path="registration" element={<Registration />} />
                  <Route path="products" element={<Products />} />
                  <Route path="faq" element={<FaqPage />} />
                  <Route path="product/:id" element={<Product />} />
                  <Route path="profile/" element={<Profile />}>
                    <Route path="details" element={<ProfileDetails />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="history" element={<History />} />
                  </Route>
                  <Route path="/checkout" element={<OrderPage />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>

                <Footer />
              </CartContext.Provider>
            </CategoriesContext.Provider>
          )}
        </AuthenticationContext.Provider>
      </NotificationContext.Provider>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        limit={5}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        // draggablePercent={60}
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
