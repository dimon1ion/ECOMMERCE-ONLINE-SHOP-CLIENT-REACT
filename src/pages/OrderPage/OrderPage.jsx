import s from "./OrderPage.module.scss";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartContext from "../../contexts/Cart.context";
import backImage from "../../assets/styles/backImage.module.scss";
import { Button, Input } from "@nextui-org/react";
import Select from "react-select";
import AuthenticationContext from "../../contexts/Authentication.context";
import request from "../../requests/request";
import ServerPath from "../../enums/ServerPath";
import getRequestWithToken from "../../requests/getRequestWithToken";
import getRequest from "../../requests/getRequest";
import { toast } from "react-toastify";

export default function OrderPage() {
  const { cart, countProducts, initCart } = useContext(CartContext);

  const {
    nameUser,
    lastNameUser,
    middleNameUser,
    emailUser,
    phoneNumberUser,
    getToken,
    checkAuthenticate,
    reloadToken,
    deleteRefreshToken,
  } = useContext(AuthenticationContext);

  const navigate = useNavigate();

  const [addressesSelect, setAddressesSelect] = useState(undefined);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    initAddresses();
  }, []);

  const initAddresses = async () => {
    const reponseAddresses = await getRequestWithToken(
      ServerPath.SERVERPATH + ServerPath.GETADDRESSES,
      getToken()
    );
    if (reponseAddresses === null) {
      //   await checkAuthenticate();
      console.log("er");
      return;
    } else if (reponseAddresses.status === 401) {
      await reloadToken();
      initAddresses();
      return;
    } else if (!reponseAddresses.ok) {
      console.log("er");
      return;
    }

    const { $values: vAddresses } = await reponseAddresses.json();

    const result = vAddresses.map(({city:{name}, first, zip, id}) => {
        return { value: id, label: `${name}, ${first}, ${zip}` };
    })

    //   vAddresses.map(())

    //   setCities(vCities.map(({ id, name }) => ({ value: id, label: name })));
    setAddressesSelect(result);
    console.log(vAddresses);
  };

  const onChangeSelected = (newValue) => {
    setSelectedAddress(newValue?.value ?? null);
  };

  const order = async () => {
    if (selectedAddress === null) {
        return;
    }
    console.log(selectedAddress);
    const url = new URL(ServerPath.SERVERPATH + ServerPath.ADDORDER);
    url.searchParams.append("addressGuid", selectedAddress);
    const response = await request("POST", url.toString(), null, null, getToken());
    if (response === null || !response.ok) {
        toast.error("error")
        return;
    }
    toast.success("Successfull");
    initCart();
    navigate("/profile");
  };

  return (
    <>
      <section className={`${backImage["back-image"]} ${s["checkout_page"]}`}>
        <div className="container">
          <h1 className={s["checkout__title"]}>Checkout</h1>
          <div className={`row ${s["main_block"]}`}>
            <div className={`col-12 col-md-8`}>
              <div className={`${s["white-block"]} ${s["profile_details"]}`}>
                <div className={s["form__input_block"]}>
                  <Input
                    bordered
                    initialValue={nameUser}
                    //   status={""}
                    color={"primary"}
                    labelPlaceholder="Name"
                    className={s["form__input"]}
                    readOnly
                    width={"100%"}
                  />
                </div>
                <div className={s["form__input_block"]}>
                  <Input
                    bordered
                    initialValue={lastNameUser}
                    //   status={""}
                    color={"primary"}
                    labelPlaceholder="Surname"
                    className={s["form__input"]}
                    width={"100%"}
                    readOnly
                  />
                </div>
                <div className={s["form__input_block"]}>
                  <Input
                    bordered
                    initialValue={middleNameUser}
                    color={"primary"}
                    labelPlaceholder="Middlename"
                    className={s["form__input"]}
                    width={"100%"}
                    readOnly
                  />
                </div>
                <div className={s["form__input_block"]}>
                  <Input
                    bordered
                    //   status={""}
                    color={"primary"}
                    initialValue={phoneNumberUser}
                    labelPlaceholder="Phone number"
                    className={s["form__input"]}
                    readOnly
                    width={"100%"}
                  />
                </div>
                <div className={s["form__input_block"]}>
                  <Input
                    bordered
                    //   status={""}
                    labelPlaceholder="Email"
                    initialValue={emailUser}
                    className={s["form__input"]}
                    color={"primary"}
                    readOnly
                    type={"email"}
                    width={"100%"}
                  />
                </div>
                <div className={s["form__input_block"]}>
                  <Select
        isMulti={false}
        isClearable={true}
        isSearchable={true}
        options={addressesSelect}
        placeholder="Select Address"
        onChange={onChangeSelected}
        className={`my-1 ${s["select123"]}`}
        isLoading={"" === undefined ? true : false}
      />
                </div>
              </div>

              {/* <div className={`${s["white-block"]} ${s["profile_addresses"]}`}>
            <h3 className={s["details__address__title"]}>Change password</h3>
          </div>
          <div className={`${s["white-block"]} ${s["profile_addresses"]}`}>
            <h3 className={s["details__address__title"]}>Addresses</h3>
          </div> */}
            </div>
            <div
              className={`${s["white-block"]} ${s["summary_block"]} col position-sticky`}
            >
              {cart.length > 0 && (
                <div className={`${s["total"]}`}>
                  <h2
                    className={`${s["total__money"]} d-flex justify-content-between`}
                  >
                    <span>Total</span>
                    <span>
                      {cart.reduce(
                        (
                          { product: { price: prev } },
                          { product: { price: current } }
                        ) => +prev + +current,
                        { product: { price: 0 } }
                      )}{" "}
                      ₼
                    </span>
                  </h2>
                  <Button
                    color={"secondary"}
                    className={s["order_button"]}
                    onPress={() => {
                      order();
                    }}
                    auto
                    disabled={!selectedAddress}
                  >
                    Checkout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
