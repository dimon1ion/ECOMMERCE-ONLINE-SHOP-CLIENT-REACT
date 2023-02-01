import "./signIn.scss";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import ButtonLoading from "../Standalone/buttonLoad/ButtonLoad";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { readJWT } from "../../Store/functions";
import InputValidation from "../../ui/InputValidation";
import ErrorMessage from "../../ui/ErrorMessage";
import CheckBox from "../../ui/CheckBox/CheckBox";
// import jwt_decode from "jwt-decode";

export default function Login(props) {
  const inputClasses = "form-control form-input";

  const navigate = useNavigate();
  const serverPath = useSelector((state) => state.server.path);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [keepLogged, setKeepLogged] = useState(false);

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

    //#region /====> Variables <====/

    let userName = document.getElementById("userName").value;
    let userNameError = document.getElementById("userNameError");
    userNameError.innerHTML = "";

    let password = document.getElementById("password").value;
    let passwordError = document.getElementById("passwordError");
    passwordError.innerHTML = "";

    let keepLogged = document.getElementById("keepLogged").checked;

    let responseError = document.getElementById("responseError");
    responseError.innerHTML = "";
    setValidateResponse(true);

    let hasError = false;

    //#endregion

    //#region /====> WEB Validate <====/

    if (userName.length === 0) {
      hasError = true;
      setValidateUserName(false);
      setUserNameErrText(userName);
      userNameError.innerHTML += getErrorHTML("User name is empty!");
    } else {
      setUserNameErrText(null);
    }
    if (password.length === 0) {
      hasError = true;
      setValidatePassword(false);
      passwordError.innerHTML += getErrorHTML("Password is empty!");
    }

    //#endregion

    if (hasError) {
      setBtnSubmitted(false);
      return;
    }

    let data = new FormData();
    data.append("login", userName);
    data.append("password", password);
    data.append("keepLogged", keepLogged);

    try {
      let response = await fetch(`${serverPath}/api/Authentication/login`, {
        method: "POST",
        body: data,
      });
      if (response.ok) {
        let result = await response.json();
        let Atoken = readJWT(result.accessToken);
        let expDate = new Date(+Atoken.exp * 1000);
        console.log(expDate.toUTCString());
        if (Atoken !== null) {
          document.cookie = `Atoken=${
            result.accessToken
          };expires=${expDate.toUTCString()}`;
          window.localStorage.setItem("Rtoken", result.refreshToken);
        } else {
          setValidateResponse(false);
          responseError.innerHTML = getErrorHTML("Error");
          hasError = true;
        }
      } else if (response.status === 400) {
        hasError = true;
        let errors = await response.json();

        //#region /====> Response Validate <====/

        if (errors["Login"] !== undefined) {
          setValidateUserName(false);
          setUserNameErrText(userName);
          userNameError.innerHTML = getErrorsHTML(errors["Login"]);
        }
        if (errors["Password"] !== undefined) {
          setValidatePassword(false);
          passwordError.innerHTML = getErrorsHTML(errors["Password"]);
        }
        if (errors["Error"] !== undefined) {
          setValidateResponse(false);
          responseError.innerHTML = getErrorsHTML(errors["Error"]);
        }

        //#endregion
      } else {
        hasError = true;
      }
    } catch (error) {
      setValidateResponse(false);
      responseError.innerHTML = getErrorHTML("Server not responding");
      hasError = true;
    }

    if (hasError) {
      setBtnSubmitted(false);
    } else {
      navigate("/home");
      window.location.reload(false);
    }

    //#region /====> Functions in SubmitForm <====/

    function getErrorHTML(errorText) {
      return `<div>${errorText}</div>`;
    }

    function getErrorsHTML(errors) {
      let errorHTMLText = "";
      errors.forEach((error) => {
        errorHTMLText += getErrorHTML(error);
      });
      return errorHTMLText;
    }

    //#endregion
  }

  //#endregion

  return (
    <div className="back-image">
      <div id="InputValid" className="container max-w-600">
        <div className="row">
          <div className="white-block">
            <div className="user-account">
              <h2 className="text-center">User Login</h2>

              <form onSubmit={OnSubmitForm}>
                <InputValidation
                  inputValue={userName}
                  setInputValue={setUserName}
                  validateValue={validateUserName}
                  setValidateValue={setValidateUserName}
                  placeholder={"User name or Email"}
                  errorText={userNameErrText}
                />

                <InputValidation
                  inputValue={password}
                  setInputValue={setPassword}
                  validateValue={validatePassword}
                  setValidateValue={setValidatePassword}
                  placeholder={"Password"}
                  errorText={passwordErrText}
                />

                <ButtonLoading submitted={btnSubmitted} text={"Login"} />
                <ErrorMessage
                  show={validateResponse}
                  errorText={responseErrText}
                />
              </form>

              <div className="user-option d-flex flex-column flex-sm-row justify-content-sm-between">
                <div className="checkbox-label col text-start">
                  <CheckBox checked={keepLogged} setChecked={setKeepLogged}>
                    Keep me logged in
                  </CheckBox>
                </div>
                <div className="mt-2 col text-start text-sm-end">
                  <NavLink className={"nav-a"} to={"/soon"}>
                    Forgot password
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
          <NavLink className="btn my-btn-primary" to={"/sign-up"}>
            Create a New Account
          </NavLink>
        </div>
      </div>
    </div>
  );
}
