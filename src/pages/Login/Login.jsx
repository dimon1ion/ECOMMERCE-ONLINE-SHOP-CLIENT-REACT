import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputValidation from "../../ui/InputValidation";
import ErrorMessage from "../../ui/ErrorMessage";
import CheckBox from "../../ui/CheckBox/CheckBox";
import ButtonLoad from "../../ui/ButtonLoad";
import s from "./Login.module.scss";
import backImage from "../../assets/styles/backImage.module.scss";
import postRequest from "../../requests/postRequest";
import jwtDecode from "jwt-decode";
import Token from "../../enums/Token";
import request from "../../requests/request";
import ServerPath from "../../enums/ServerPath";
import AuthenticationContext from "../../contexts/Authentication.context";
import { Button, Modal, Text, useModal } from "@nextui-org/react";

export default function Login(props) {
  //   const inputClasses = "form-control form-input";

  const navigate = useNavigate();
  const { isAuthenticated, writeAccesToken, writeRefreshToken, checkAuthenticate } = useContext(
    AuthenticationContext
  );

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [keepLogged, setKeepLogged] = useState(false);

  const [userNameErrValue, setUserNameErrValue] = useState(null);
  const [passwordErrValue, setPasswordErrValue] = useState(null);

  const [userNameErrText, setUserNameErrText] = useState(null);
  const [passwordErrText, setPasswordErrText] = useState(null);
  const [responseErrText, setResponseErrText] = useState(null);

  //#region /===> Valid input changed: True or False <====/

  const [validateUserName, setValidateUserName] = useState(true);
  const [validatePassword, setValidatePassword] = useState(true);
  const [validateResponse, setValidateResponse] = useState(true);

  //#endregion

  const [btnSubmitted, setBtnSubmitted] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { setVisible, bindings } = useModal();

  //#region /===> Functions <===/

  async function OnResetPassword() {
    const url = new URL(`${ServerPath.SERVERPATH}${ServerPath.RESETPASSWORD}`);
    url.searchParams.append("email", userName);
    const response = await request("POST", url.toString(), null, null, null);
    if (response === null) {
      console.log("Error");
      return false;
    } else if (response.status === 400) {
      const data = await response.json();
      if (data["error_message"]) {
        console.log("hey");
        setResponseErrText(data["error_message"]);
        setValidateResponse(false);
      }
      return false;
    } else if (!response.ok) {
      return false;
    }
    return true;
  }

  async function OnSubmitForm(event) {
    event.preventDefault();
    setBtnSubmitted(true);
    setValidateResponse(true);

    if (isForgotPassword) {
      const isReset = await OnResetPassword();
      setBtnSubmitted(false);
      if (!isReset) {
        throw "error"
      }
      setVisible(true);
      return;
    }

    let hasError = false;

    //#region /====> WEB Validate <====/

    if (userName.trim().length === 0) {
      hasError = true;
      setValidateUserName(false);
      setUserNameErrValue(userName);
      setUserNameErrText("User name is empty!");
    } else {
      setUserNameErrValue(null);
    }
    if (password.trim().length === 0) {
      hasError = true;
      setValidatePassword(false);
      setPasswordErrValue(password);
      setPasswordErrText("Password is empty!");
    } else {
      setPasswordErrValue(null);
    }

    //#endregion

    if (hasError) {
      setBtnSubmitted(false);
      return;
    }
    let data = {
      email: userName,
      password: password,
    };

    const url = new URL(`${ServerPath.SERVERPATH}${ServerPath.LOGIN}`);
    url.searchParams.append("rememberMe", keepLogged);
    // console.log(url.toString());
    const response = await postRequest(url.toString(), data);

    if (response === null) {
      setValidateResponse(false);
      setResponseErrText(
        "Prevention is currently underway. Try again in a few minutes"
      );
      hasError = true;
    } else if (response.ok) {
      const { accessToken, refreshToken } = await response.json();
      if (!writeAccesToken(accessToken)) {
        setValidateResponse(false);
        setResponseErrText(
          "Prevention is currently underway. Try again in a few minutes"
        );
        hasError = true;
      }
      writeRefreshToken(refreshToken);
    } else if (response.status === 400) {
      hasError = true;
      let errors = await response.json();
      //#region /====> Response Validate <====/
      // if (errors["Login"] !== undefined) {
      //   setValidateUserName(false);
      //   setUserNameErrValue(userName);
      //   setUserNameErrText(errors["Login"]);
      // }
      // if (errors["Password"] !== undefined) {
      //   setValidatePassword(false);
      //   setPasswordErrValue(password);
      //   setPasswordErrText(errors["Password"]);
      // }
      if (errors["error_message"] !== undefined) {
        setValidateResponse(false);
        setResponseErrText(errors["error_message"]);
      }

      //#endregion
    } else {
      hasError = true;
    }

    if (hasError) {
      setBtnSubmitted(false);
    } else {
      checkAuthenticate();
      navigate("/profile");
    }
  }

  //#endregion

  return (
    <div className={backImage["back-image"]}>
      <div className={`container ${s["max-w-600"]}`}>
        <div className="row">
          <div className={s["white-block"]}>
            <div className={s["user-account"]}>
              <h2 className="text-center">{isAuthenticated ? "Account change" : "User Login"}</h2>

              <form onSubmit={OnSubmitForm}>
                <InputValidation
                  inputValue={userName}
                  setInputValue={setUserName}
                  validateValue={validateUserName}
                  setValidateValue={setValidateUserName}
                  placeholder={"Email"}
                  errorValue={userNameErrValue}
                  errorText={userNameErrText}
                  type={"email"}
                />

                {isForgotPassword || (
                  <InputValidation
                    inputValue={password}
                    setInputValue={setPassword}
                    validateValue={validatePassword}
                    setValidateValue={setValidatePassword}
                    placeholder={"Password"}
                    errorValue={passwordErrValue}
                    errorText={passwordErrText}
                    type={"password"}
                  />
                )}

                <ButtonLoad
                  submitted={btnSubmitted}
                  disabled={!validateUserName || !validatePassword}
                >
                  {isForgotPassword ? "Submit" : "Login"}
                </ButtonLoad>
                <ErrorMessage show={validateResponse}>
                  {responseErrText}
                </ErrorMessage>
              </form>
              <div
                className={`${s["user-option"]} d-flex flex-column flex-sm-row justify-content-sm-between`}
              >
                <div className={`${s["checkbox-label"]} col text-start`}>
                  {isForgotPassword || (
                    <CheckBox checked={keepLogged} setChecked={setKeepLogged}>
                      Keep me logged in
                    </CheckBox>
                  )}
                </div>
                <div className="mt-2 col d-flex justify-content-start justify-content-sm-end">
                  <Button
                    className={`${s["forgot_password_button"]} ${s["unselect"]}`}
                    onPress={() => setIsForgotPassword((state) => !state)}
                    light
                    auto
                  >
                    {isForgotPassword ? "Login" : "Forgot password"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <NavLink
            className={`btn ${s["my-btn-primary"]}`}
            to={"/registration"}
          >
            Create a New Account
          </NavLink>
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
            Change Password
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text id="modal-description">
            An email has been sent to this email address with instructions to reset your password.
          </Text>
        </Modal.Body>
        <Modal.Footer>
          <Button auto onPress={() => setVisible(false)}>
            Agree
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
