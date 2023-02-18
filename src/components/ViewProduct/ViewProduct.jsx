import { Button, Input } from "@nextui-org/react";
import { NavLink, useNavigate } from "react-router-dom";
import TextMore from "../../ui/TextMore/TextMore";
import s from "./ViewProduct.module.scss";
import cartImage from "../../assets/Images/cart_black_icon.svg";
import trashIcon from "../../assets/Images/trash_icon.svg";
import { useContext, useEffect, useState } from "react";
import CartContext from "../../contexts/Cart.context";
import AuthenticationContext from "../../contexts/Authentication.context";
import RatingComponent from "../RatingComponent/RatingComponent";
import useToggle from "../../hooks/useToggle";
import useCounter from "../../hooks/useCounter";

export default function ViewProduct({
  productId,
  price,
  name,
  photoUrl,
  textInfo,
  inStock,
  date = undefined,
  rating,
  counter = false,
  deleteFromCart = false,
  quantityInCart,
  nonebutton = false,
  idOrder,
}) {
  const { isAuthenticated } = useContext(AuthenticationContext);
  const {
    cart,
    countProducts,
    findProductById,
    addToCart,
    removeFromCart,
    changeCountProductInCart,
  } = useContext(CartContext);
  const [productHasInCart, setProductHasInCart] = useState(false);
  const [changeState, setChangeState] = useState(false);
  const {
    isOpen: counterIsEnable,
    open: enableCounter,
    close: disableCounter,
  } = useToggle(true);
  const {
    count: countInCart,
    increase,
    decrease,
    changeCount,
  } = useCounter(0, 99, 1);

  useEffect(() => {
    const product = findProductById(productId);
    console.log(product);
    setProductHasInCart(findProductById(productId) !== undefined);
  }, [cart, productId]);

  useEffect(() => {
    if (!counter) {
      return;
    }
    changeCount(quantityInCart);
  }, [quantityInCart]);

  useEffect(() => {
    if (!counter) {
      return;
    }
    if (
      !quantityInCart ||
      countInCart === quantityInCart ||
      countInCart === 0
    ) {
      return;
    }
    changeCountInCart();
  }, [changeState]);

  const handleChangeCountInCart = () => {
    setChangeState((state) => !state);
  };

  const changeCountInCart = async () => {
    disableCounter();
    console.log(countInCart);
    await changeCountProductInCart(productId, countInCart);
    enableCounter();
  };

  const addProductToCart = async () => {
    await addToCart(productId);
  };

  const removeProductFromCart = async () => {
    await removeFromCart(productId);
  };

  const navigate = useNavigate();

  return (
    <>
      <div className={`row ${s["zoom"]}`}>
        {!nonebutton && (<NavLink
          to={`/product/${productId}`}
          className={`${s["navlink"]} ${s["block_image"]} col-12 col-md-5 col-lg-4 text-center`}
        >
          <img className={s["image"]} src={photoUrl} alt={name} />
        </NavLink>)}
        <div className={`col ${s["info"]}`}>
          {nonebutton && (<div className="my-1">
            <span className={s["number-name"]}>Order №{idOrder}</span>
          </div>)}
          <NavLink to={`/product/${productId}`} className={`${s["navlink"]}`}>
            <h5>{price} ₼</h5>
            <span className={s["product-name"]}>{name}</span>
          </NavLink>
          {!nonebutton && (<div className="my-1">
            <RatingComponent rating={rating} />
          </div>)}
          {counter && quantityInCart && (
            <div className="my-1 d-flex">
              <Button
                ghost
                color={"gradient"}
                className={s["button_counter"]}
                disabled={!counterIsEnable}
                onPress={() => {
                  decrease();
                  handleChangeCountInCart();
                }}
                auto
              >
                -
              </Button>
              <Input
                disabled={!counterIsEnable}
                value={countInCart}
                onChange={({ target: { value } }) => changeCount(+value)}
                onBlur={() => changeCountInCart}
                type={"number"}
                width={"auto"}
              />
              <Button
                ghost
                color={"gradient"}
                className={s["button_counter"]}
                disabled={!counterIsEnable}
                onPress={() => {
                  increase();
                  handleChangeCountInCart();
                }}
                auto
              >
                +
              </Button>
            </div>
          )}
          <div className={s["product-info"]}>
            {counter || (
              <TextMore maxSymbols={100} maxRows={2} text={textInfo} />
            )}
          </div>
        </div>
        {/* <div className={`${s["additionally"]} d-none ${s["w-larger"]}`}> */}
        {/* <div className={`${s["left-icons"]} d-flex`}> */}
        {/* {date && <span>{date.toDateString()}</span>} */}
        {/* </div> */}
        {/* <span className={s["tags"]}>Used</span> */}
        {/* <div className={s["icons"]}>
                                          <span href="#" className={s["nav-icon"]} title="Los Angeles"></span>
                                          <span href="#" className={s["individual"]} title="Individual"></span>
                                        </div> */}
        {/* </div> */}
        <div
          className={`${s["additionally"]} col-12 ${s["w-smaller"]} d-flex flex-column justify-content-center flex-sm-row justify-content-sm-between align-items-sm-center`}
        >
          {date && (
            <div className={`${s["created_date"]} text-center`}>
              Publication date: {date.toDateString()}
            </div>
          )}
          {!nonebutton && (<Button
            bordered={productHasInCart}
            color={deleteFromCart ? "error" : "success"}
            className={`${s["add_to_cart_button"]}`}
            icon={(deleteFromCart ? (<img src={trashIcon} className={s["icon-image"]} />) : (<img src={cartImage} className={s["icon-image-m"]} />))}
            light
            auto
            onPress={() => {
              if (deleteFromCart) {
                removeProductFromCart();
              }
              if (productHasInCart) {
                navigate("/profile/cart");
                return;
              }
              if (!isAuthenticated) {
                navigate("/login");
                return;
              }
              addProductToCart();
            }}
            disabled={!inStock}
          >
            {deleteFromCart ? "" : !inStock
              ? "Not available"
              : productHasInCart
              ? "In Cart"
              : "Add to Cart"}
          </Button>)}
        </div>
      </div>
    </>
  );
}
