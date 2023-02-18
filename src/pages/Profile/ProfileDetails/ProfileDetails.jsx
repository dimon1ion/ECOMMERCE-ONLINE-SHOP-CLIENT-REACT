import { Button, Input, Modal, Text, useModal } from "@nextui-org/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthenticationContext from "../../../contexts/Authentication.context";
import NotificationContext from "../../../contexts/Notification.context";
import ServerPath from "../../../enums/ServerPath";
import getRequest from "../../../requests/getRequest";
import getRequestWithToken from "../../../requests/getRequestWithToken";
import request from "../../../requests/request";
import Banner from "../../../ui/Banner/Banner";
import ErrorMessage from "../../../ui/ErrorMessage";
import Address from "./Address/Address";
import s from "./ProfileDetails.module.scss";

export default function ProfileDetails(props) {
  const emptyValidRegex = /.*\S.*/;
  const regexPhoneString =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [email, setEmail] = useState("");
  const [oldPhoneNumber, setOldPhoneNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [cities, setCities] = useState(undefined);
  const [addresses, setAddresses] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isErrorChangePassword, setIsErrorChangePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessagePassword, setErrorMessagePassword] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const { setVisible, bindings } = useModal();

  const navigate = useNavigate();

  const { toastOptions } = useContext(NotificationContext);

  const {
    isAuthenticated,
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

  useEffect(() => {
    setName(nameUser);
  }, [nameUser]);
  useEffect(() => {
    setSurname(lastNameUser);
  }, [lastNameUser]);

  useEffect(() => {
    if (middleNameUser === "") {
      setMiddleName(" ");
      return;
    }
    setMiddleName(middleNameUser);
  }, [middleNameUser]);
  useEffect(() => {
    setPhoneNumber(phoneNumberUser);
    setOldPhoneNumber(phoneNumberUser);
  }, [phoneNumberUser]);
  useEffect(() => {
    setEmail(emailUser);
    setOldEmail(emailUser);
  }, [emailUser]);

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

    const responseCities = await getRequest(
      ServerPath.SERVERPATH + ServerPath.GETCITIES
    );
    if (responseCities === null || !responseCities.ok) {
      console.log("er");
      return;
    }

    const { $values: vCities } = await responseCities.json();
    const { $values: vAddresses } = await reponseAddresses.json();

    setCities(vCities.map(({ id, name }) => ({ value: id, label: name })));
    setAddresses(vAddresses);
    console.log(vAddresses);
  };
  const validEmail = useMemo(() => {
    const isValid = email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
    return {
      text: isValid ? "" : "Enter a valid email",
      color: isValid ? "primary" : "error",
      status: isValid ? "" : "error",
      isValid,
    };
  }, [email]);

  const checkValue = (value, regex, { errorMessage, successMessage }) => {
    const isValid = value.match(regex);
    return {
      text: isValid ? successMessage || "" : errorMessage || "",
      color: isValid ? "primary" : "error",
      status: isValid ? "" : "error",
      isValid
    };
  };

  const validName = useMemo(() => {
    return checkValue(name, emptyValidRegex, {
      errorMessage: "Value is Empty",
    });
  }, [name]);
  const validSurname = useMemo(() => {
    return checkValue(surname, emptyValidRegex, {
      errorMessage: "Value is Empty",
    });
  }, [surname]);
  const validPhoneNumber = useMemo(() => {
    return checkValue(phoneNumber, regexPhoneString, {
      errorMessage: "Wrong format number",
    });
  }, [phoneNumber]);

  const addAddress = () => {
    setAddresses((state) => {
      state.push({ first: "", zip: "", id: undefined, city: undefined });
      const res = state.map((item) => item);
      return res;
    });
  };

  const deleteAddress = async () => {
    if (addresses.length < 1) {
      return;
    }
    const [element] = addresses.splice(addresses.length - 1, 1);
    console.log(element);
    if (element.id) {
      console.log("zzzz");
      const response = await request(
        "DELETE",
        ServerPath.SERVERPATH + ServerPath.DELETEADDRESS + `/${element.id}`,
        null,
        null,
        getToken()
      );
      if (response === null || !response.ok) {
        return;
      }
    }
    const res = addresses.map((item) => item);
    console.log("zzzz2");
    console.log(res);
    setAddresses(res);
  };

  const onSubmitChanges = async (event) => {
    event.preventDefault();
    setIsError(false);
    const message = [];

    const infoUrl = new URL(ServerPath.SERVERPATH + ServerPath.CHANGEUSERINFO);
    infoUrl.searchParams.append("first", name);
    infoUrl.searchParams.append("last", surname);
    infoUrl.searchParams.append("middle", middleName);
    const InfoResponse = await request(
      "PATCH",
      infoUrl.toString(),
      null,
      null,
      getToken()
    );
    if (InfoResponse === null) {
      console.log("err");
      throw "error";
    } else if (InfoResponse.status === 401) {
      console.log("err1");
      await reloadToken();
      if (isAuthenticated === false) {
        throw "error";
      }
      onSubmitChanges(event);
      return;
    } else if (InfoResponse.status === 400) {
      console.log("err2");
      const data = await InfoResponse.json();
      setIsError(true);
      setErrorMessage(data["error_message"] || "");
      throw "error";
    } else if (!InfoResponse.ok) {
      console.log("err3");
      throw "error";
    }

    if (oldPhoneNumber !== phoneNumber) {
      const url = new URL(ServerPath.SERVERPATH + ServerPath.CHANGEPHONE);
      url.searchParams.append("phone", phoneNumber);
      const response = await request(
        "GET",
        url.toString(),
        null,
        null,
        getToken()
      );
      if (response === null) {
        console.log("err");
        throw "error";
      } else if (response.status === 401) {
        console.log("err1");
        await reloadToken();
        if (isAuthenticated === false) {
          throw "error";
        }
        onSubmitChanges(event);
        return;
        return;
      } else if (response.status === 400) {
        console.log("err2");
        const data = await response.json();
        setIsError(true);
        setErrorMessage(data["error_message"] || "");
        throw "error";
      } else if (!response.ok) {
        console.log("err3");
        throw "error";
      }
      message.push("phone number");
    }

    if (email !== oldEmail) {
      const url = new URL(ServerPath.SERVERPATH + ServerPath.CHANGEEMAIL);
      console.log("work");
      url.searchParams.append("newEmail", email);
      const response = await request(
        "GET",
        url.toString(),
        null,
        null,
        getToken()
      );
      console.log("work3");
      if (response === null) {
        console.log("err");
        throw "error";
      } else if (response.status === 401) {
        console.log("err1");
        await reloadToken();
        if (isAuthenticated === false) {
          throw "error";
        }
        onSubmitChanges(event);
        return;
        return;
      } else if (response.status === 400) {
        console.log("err2");
        const data = await response.json();
        setIsError(true);
        setErrorMessage(data["error_message"] || "");
        throw "error";
      } else if (!response.ok) {
        console.log("err3");
        throw "error";
      }
      message.push("email address");
      setVisible(true);
      deleteRefreshToken();
    }
    if (message.length !== 0) {
      setModalMessage(
        `Your ${message.join(
          ", "
        )} has almost changed .An email has been sent to you with a confirmation link.`
      );
      setVisible(true);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    const url = new URL(ServerPath.SERVERPATH + ServerPath.CHANGEPASSWORD);
    url.searchParams.append("oldPassword", oldPassword);
    url.searchParams.append("newPassword", newPassword);
    const response = await request(
      "POST",
      url.toString(),
      null,
      null,
      getToken()
    );
    if (response === null) {
      console.log("error");
      throw "error";
    } else if (response.status === 401) {
      await reloadToken();
      if (isAuthenticated === false) {
        throw "error";
      }
      changePassword(event);
      return;
    }
    else if (response.status === 400) {
        const data = await response.json();
        setIsErrorChangePassword(true);
        setErrorMessagePassword(data["error_message"] || undefined);
        throw "error";
    }
    else if(!response.ok){
      throw "error";
    }
  };

  return (
    <>
      <div className={`row ${s["main_block"]}`}>
        <div className={`col-12 col-md-8`}>
          <div className={`${s["white-block"]} ${s["profile_details"]}`}>
            <h2 className={s["profile_details__title"]}>Profile Details</h2>
            <form
              onSubmit={(event) =>
                toast.promise(
                  onSubmitChanges(event),
                  {
                    pending: "Saving..",
                    error: "Error",
                    success: "Saved successfully",
                  },
                  toastOptions
                )
              }
              className={s["profile_details__form"]}
            >
              <div className={s["form__input_block"]}>
                <Input
                  bordered
                  clearable
                  initialValue={nameUser}
                  status={validName.status}
                  color={validName.color}
                  helperColor={validName.color}
                  helperText={validName.text}
                  onChange={({ target: { value } }) => setName(value)}
                  labelPlaceholder="Name"
                  className={s["form__input"]}
                  width={"100%"}
                />
              </div>
              <div className={s["form__input_block"]}>
                <Input
                  bordered
                  clearable
                  initialValue={lastNameUser}
                  status={validSurname.status}
                  color={validSurname.color}
                  helperColor={validSurname.color}
                  helperText={validSurname.text}
                  onChange={({ target: { value } }) => setSurname(value)}
                  labelPlaceholder="Surname"
                  className={s["form__input"]}
                  width={"100%"}
                />
              </div>
              <div className={s["form__input_block"]}>
                <Input
                  bordered
                  clearable
                  initialValue={middleNameUser}
                  color={"primary"}
                  onChange={({ target: { value } }) => setMiddleName(value)}
                  labelPlaceholder="Middlename"
                  className={s["form__input"]}
                  width={"100%"}
                />
              </div>
              <div className={s["form__input_block"]}>
                <Input
                  bordered
                  clearable
                  status={validPhoneNumber.status}
                  color={validPhoneNumber.color}
                  helperColor={validPhoneNumber.color}
                  helperText={validPhoneNumber.text}
                  initialValue={phoneNumberUser}
                  onChange={({ target: { value } }) => setPhoneNumber(value)}
                  labelPlaceholder="Phone number"
                  className={s["form__input"]}
                  width={"100%"}
                />
              </div>
              <div className={s["form__input_block"]}>
                <Input
                  bordered
                  clearable
                  labelPlaceholder="Email"
                  initialValue={emailUser}
                  onChange={({ target: { value } }) => setEmail(value)}
                  className={s["form__input"]}
                  status={validEmail.status}
                  color={validEmail.color}
                  helperColor={validEmail.color}
                  helperText={validEmail.text}
                  type={"email"}
                  width={"100%"}
                />
              </div>
              <div
                className={`${s["form__button_block"]} d-flex flex-column flex-sm-row justify-content-sm-between`}
              >
                <div>
                  <ErrorMessage show={!isError}>{errorMessage}</ErrorMessage>
                </div>
                <Button color={"success"} ghost auto type="submit" disabled={!validPhoneNumber.isValid || !validEmail.isValid}>
                  Submit changes
                </Button>
              </div>
            </form>
          </div>
          <div className={`${s["white-block"]} ${s["profile_addresses"]}`}>
            <h3 className={s["details__address__title"]}>Change password</h3>
            {/* {addresses.map(({ first, zip, id, city }, index) => (
              <div className={s["details__addresses"]} key={index}>
                <Address
                  addresses={addresses}
                  setAddresses={setAddresses}
                  cities={cities}
                  first={first}
                  index={index}
                  zip={zip}
                  idAddress={id}
                  selectedCity={city && { value: city.id, label: city.name }}
                />
              </div>
            ))} */}
            <form
              onSubmit={(event) =>
                toast.promise(changePassword(event), {
                  error: "Error",
                  pending: "Changing..",
                  success: "Password changed",
                }, toastOptions)
              }
            >
              <div className={s["form__input_block"]}>
                <Input.Password
                  // bordered
                  // clearable
                  color={"primary"}
                  onChange={({ target: { value } }) => setOldPassword(value)}
                  labelPlaceholder="Old password"
                  className={s["form__input"]}
                  width={"100%"}
                  type={"password"}
                />
              </div>
              <div className={s["form__input_block"]}>
                <Input.Password
                  // bordered
                  // clearable
                  color={"primary"}
                  onChange={({ target: { value } }) => setNewPassword(value)}
                  labelPlaceholder="New Password"
                  className={s["form__input"]}
                  width={"100%"}
                  type={"password"}
                />
              </div>
              <div
                className={`${s["form__button_block"]} d-flex flex-column flex-sm-row justify-content-sm-between`}
              >
                <div>
                  <ErrorMessage show={!isErrorChangePassword}>
                    {errorMessagePassword}
                  </ErrorMessage>
                </div>
                <Button
                  color={"success"}
                  type={"submit"}
                  ghost
                  auto
                  disabled={!newPassword || !oldPassword}
                >
                  Change password
                </Button>
              </div>
            </form>
          </div>
          <div className={`${s["white-block"]} ${s["profile_addresses"]}`}>
            <h3 className={s["details__address__title"]}>Addresses</h3>
            {addresses.map(({ first, zip, id, city }, index) => (
              <div className={s["details__addresses"]} key={index}>
                <Address
                  addresses={addresses}
                  setAddresses={setAddresses}
                  cities={cities}
                  first={first}
                  index={index}
                  zip={zip}
                  idAddress={id}
                  selectedCity={city && { value: city.id, label: city.name }}
                />
              </div>
            ))}
            <div className="d-flex flex-column flex-sm-row">
              <Button
                color={"primary"}
                onPress={() => {
                  addAddress();
                }}
                bordered
                auto
              >
                Add address
              </Button>
            </div>
          </div>
        </div>
        <div className={`${s["white-block"]} ${s["banner"]} col`}>
          <Banner />
        </div>
      </div>
      <Modal
        scroll
        width="600px"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        {...bindings}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Successfully
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text id="modal-description">{modalMessage}</Text>
        </Modal.Body>
        <Modal.Footer>
          <Button auto onPress={() => setVisible(false)}>
            Agree
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
