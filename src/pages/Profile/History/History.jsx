import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ViewProduct from "../../../components/ViewProduct/ViewProduct";
import AuthenticationContext from "../../../contexts/Authentication.context";
import ServerPath from "../../../enums/ServerPath";
import request from "../../../requests/request";
import Banner from "../../../ui/Banner/Banner";
import s from "./History.module.scss";

export default function History() {
  const { getToken } = useContext(AuthenticationContext);

  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    initOrders();
  }, []);

  const initOrders = async () => {
    console.log(getToken());
    const url = new URL(ServerPath.SERVERPATH + ServerPath.GETORDERS);
    url.searchParams.append("page", 1);
    const response = await request(
      "GET",
      url.toString(),
      null,
      null,
      getToken()
    );

    if (response === null || !response.ok) {
      console.log("error");
      // navigate("/profile");
      return;
    }
    const url2 = new URL(ServerPath.SERVERPATH + ServerPath.GETOORDERSTATUSES);
    const response2 = await request("GET", url2.toString(), null, null, null);

    if (response2 === null || !response2.ok) {
      console.log("error");
      // navigate("/profile");
      return;
    }
    const {
      orders: { $values },
    } = await response.json();
    const { $values: resStatuses } = await response2.json();

    console.log($values);
    console.log(resStatuses);
    // setOrders($values.map((item) => {
    //     item.orderStatus = resStatuses.find((key) => key === item.orderStatus)?.value;
    //     return item;
    // }));
    setOrders($values);
  };

  return (
    <>
      <div className={`row ${s["main_block"]}`}>
        <div className={`col-12 col-md-8`}>
          <div className={`${s["cart"]} ${s["white-block"]}`}>
            <h2 className={s["cart__title"]}>My Orders</h2>
            <div className="d-flex flex-column">
              {orders?.map(
                (
                  {
                    productName,
                    inStock,
                    price,
                    description,
                    orderTime,
                    rating,
                    id,
                    productId
                  },
                  index
                ) => (
                  <div className="my-2" key={index}>
                    <ViewProduct
                      name={productName}
                      inStock={inStock}
                      price={price}
                      textInfo={description}
                      date={new Date(orderTime)}
                      productId={productId}
                      rating={rating}
                      idOrder={id}
                      //   deleteFromCart
                      //   counter
                      //   quantityInCart={quantity}
                      nonebutton={true}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div className={`${s["white-block"]} ${s["banner"]} col`}>
          <Banner />
        </div>
      </div>
    </>
  );
}
