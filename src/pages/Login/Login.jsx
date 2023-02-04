import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputValidation from "../../ui/InputValidation";
import ErrorMessage from "../../ui/ErrorMessage";
import CheckBox from "../../ui/CheckBox/CheckBox";
import ButtonLoad from "../../ui/ButtonLoad";
import s from "./Login.module.scss";
import backImage from "../../assets/styles/backImage.module.scss";
import putRequest from "../../requests/putRequest";
import jwtDecode from "jwt-decode";
import Token from "../../enums/Token";
import ServerPath from "../../enums/ServerPath";
import AuthenticationContext from "../../contexts/Authentication.context";

export default function Login(props) {
  //   const inputClasses = "form-control form-input";

  const navigate = useNavigate();
  const { writeAccesToken, writeRefreshToken, checkAuthenticate } = useContext(
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

  //#region /===> Functions <===/

  async function OnSubmitForm(event) {
    event.preventDefault();
    setBtnSubmitted(true);
    setValidateResponse(true);
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
    const response = await putRequest(url.toString(), data);

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
              <h2 className="text-center">User Login</h2>

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

                <ButtonLoad
                  submitted={btnSubmitted}
                  disabled={
                    !validateUserName || !validatePassword
                  }
                >
                  Login
                </ButtonLoad>
                <ErrorMessage show={validateResponse}>
                  {responseErrText}
                </ErrorMessage>
              </form>

              <div
                className={`${s["user-option"]} d-flex flex-column flex-sm-row justify-content-sm-between`}
              >
                <div className={`${s["checkbox-label"]} col text-start`}>
                  <CheckBox checked={keepLogged} setChecked={setKeepLogged}>
                    Keep me logged in
                  </CheckBox>
                </div>
                <div className="mt-2 col text-start text-sm-end">
                  <NavLink
                    className={`${s["nav-a"]} ${s["unselect"]}`}
                    to={"/soon"}
                  >
                    Forgot password
                  </NavLink>
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
    </div>
  );
}
