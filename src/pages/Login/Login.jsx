import { NavLink } from "react-router-dom";
import { useState } from "react";
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

export default function Login(props) {
  //   const inputClasses = "form-control form-input";

  const navigate = useNavigate();

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

    if (userName.length === 0) {
      hasError = true;
      setValidateUserName(false);
      setUserNameErrValue(userName);
      setUserNameErrText("User name is empty!");
    } else {
      setValidateUserName(true);
    }
    if (password.length === 0) {
      hasError = true;
      setValidatePassword(false);
      setPasswordErrValue(password);
      setPasswordErrText("Password is empty!");
    } else {
      setValidatePassword(true);
    }

    //#endregion

    if (hasError) {
      setBtnSubmitted(false);
      return;
    }
    console.log(userName);
    console.log(password);
    let data = {
      email: userName,
      password: password,
    };

    const response = await putRequest(
      `${ServerPath.SERVERPATH}${ServerPath.LOGIN}`,
      data
    );

    if (response === null) {
      setValidateResponse(false);
      setResponseErrText(
        "Prevention is currently underway. Try again in a few minutes"
      );
      hasError = true;
    } else if (response.ok) {
      try {
        const result = await response.json();
        const Atoken = jwtDecode(result.accessToken);
        let expDate = new Date(+Atoken.exp * 1000);
        console.log(expDate.toUTCString());
        document.cookie = `${Token.ACCESTOKEN}=${
          result.accessToken
        };expires=${expDate.toUTCString()}`;
        window.localStorage.setItem(Token.REFRESHTOKEN, result.refreshToken);
      } catch (error) {
        setValidateResponse(false);
        setResponseErrText(
          "Prevention is currently underway. Try again in a few minutes"
        );
        hasError = true;
      }
    } else if (response.status === 400) {
      hasError = true;
      let errors = await response.json();
      console.log(errors);
      //#region /====> Response Validate <====/
      if (errors["Login"] !== undefined) {
        setValidateUserName(false);
        setUserNameErrValue(userName);
        setUserNameErrText(errors["Login"]);
      }
      if (errors["Password"] !== undefined) {
        setValidatePassword(false);
        setPasswordErrValue(password);
        setPasswordErrText(errors["Password"]);
      }
      if (errors["Error"] !== undefined) {
        setValidateResponse(false);
        setResponseErrText(errors["Error"]);
      }

      //#endregion
    } else {
      hasError = true;
    }

    if (hasError) {
      setBtnSubmitted(false);
    } else {
      navigate("/home");
      console.log("Vse ok");
      //   window.location.reload(false);
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
                  placeholder={"User name or Email"}
                  errorValue={userNameErrValue}
                  errorText={userNameErrText}
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

                <ButtonLoad submitted={btnSubmitted}>Login</ButtonLoad>
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
                  <NavLink className={s["nav-a"]} to={"/soon"}>
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
