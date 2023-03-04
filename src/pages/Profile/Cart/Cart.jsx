import { Button } from "@nextui-org/react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ViewProduct from "../../../components/ViewProduct/ViewProduct";
import CartContext from "../../../contexts/Cart.context";
import Banner from "../../../ui/Banner/Banner";
import s from "./Cart.module.scss";

export default function Cart() {
  const { cart, countProducts } = useContext(CartContext);

  const navigate = useNavigate();

  return (
    <>
      <div className={`row ${s["main_block"]}`}>
        <div className={`col-12 col-md-8`}>
          <div className={`${s["cart"]} ${s["white-block"]}`}>
            <h2 className={s["cart__title"]}>
              My Cart:{" "}
              <span className={s["cart__title__green-text"]}>
                {countProducts} product(-s)
              </span>
            </h2>
            <div className="d-flex flex-column">
              {cart?.map(
                (
                  {
                    product: {
                      name,
                      inStock,
                      productPhotos,
                      price,
                      description,
                      creationTime,
                      rating,
                      id,
                    },
                    quantity,
                  },
                  index
                ) => (
                  <div className="my-2" key={index}>
                    <ViewProduct
                      name={name}
                      inStock={inStock}
                      photoUrl={productPhotos?.$values?.at(0)?.url}
                      price={price}
                      textInfo={description}
                      date={new Date(creationTime)}
                      productId={id}
                      rating={rating}
                      deleteFromCart
                      counter
                      quantityInCart={quantity}
                    />
                  </div>
                )
              )}
            </div>
          </div>
          {cart.length > 0 && (<div className={`${s["total"]}`}>
            <h2 className={`${s["total__money"]} d-flex justify-content-between`}>
              <span>Total</span>
                  {console.log(cart) }
              <span>{cart.map((item)=>item.product.price*item.quantity).reduce((total, current) => +total + +current, 0)} ₼</span>
            </h2>
            <Button color={"secondary"} className={s["order_button"]} onPress={() => {navigate("/checkout")}} auto>Order now</Button>

          </div>)}
        </div>
        <div className={`${s["white-block"]} ${s["banner"]} col`}>
          <Banner />
        </div>
      </div>
    </>
  );
}
