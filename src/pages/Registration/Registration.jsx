import "./signUp.scss";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { initCities } from "../../Store/citiesStore";
import Select from "react-select";
// import ButtonLoading from "../Standalone/buttonLoad/ButtonLoad";
import { useNavigate } from "react-router-dom";
import { GenerateArrayForSelect, readJWT } from "../../Store/functions";
// import { CitiesLoad } from "../../Store/dataFunctions";

export default function Registration() {
  //On Load Component Function
  
//   async function handleCities(){
//     let result = await CitiesLoad(serverPath + getAllCitiesPath);
//     if (result != null) {
//       dispatch(initCities(result));
//     }
//   }

//   useEffect(() => {
//     if (canChangeCities === true) {
//       handleCities();
//     }
//     // if (cities === undefined && allCities !== undefined) {
//     //   setCities(GenerateArrayForSelect(allCities));
//     // }
//   });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Store states
  const serverPath = useSelector((state) => state.server.path);
//   const getAllCitiesPath = useSelector((state) => state.citiesStore.getAllPath);
  // const allCities = useSelector((state) => state.citiesStore.allCities);
//   const cities = useSelector((state) => state.citiesStore.allCitiesSelectType);
//   const canChangeCities = useSelector((state) => state.citiesStore.canChangeCities);

  

  //#region /====> For use in code <====/

  const inputClasses = "form-control form-input";
  const regexEmailString =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const regexPasswordString =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  const regexPhoneString =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

  //#endregion

  //#region /====> ErrorText When was Submit <====/

  const [userNameErrText, setUserNameErrText] = useState(null);
  const [nameErrText, setNameErrText] = useState(null);
  const [surnameErrText, setSurnameErrText] = useState(null);
  const [middleNameErrText, setMiddleNameErrText] = useState(null);
  const [emailErrText, setEmailErrText] = useState(null);
  const [phoneNumberErrText, setPhoneNumberErrText] = useState(null);
//   const [cityErrText, setCityErrText] = useState(null);
  const [agreementErrText, setAgreementErrText] = useState(null);

  //#endregion

  //#region /===> Valid input: True or False <====/

  const [validateUserName, setValidateUserName] = useState(true);
  const [validateName, setValidateName] = useState(true);
  const [validateSurname, setValidateSurname] = useState(true);
  const [validateMiddleName, setValidateMiddleName] = useState(true);
  const [validateEmail, setValidateEmail] = useState(true);
  const [validatePassword, setValidatePassword] = useState(true);
  const [validateConfirmPassword, setValidateConfirmPassword] = useState(true);
  const [validatePhoneNumber, setValidatePhoneNumber] = useState(true);
//   const [validateCity, setValidateCity] = useState(true);
  const [validateAgreement, setValidateAgreement] = useState(true);
  const [validateResponse, setValidateResponse] = useState(true);

  //#endregion

  //Input Values
//   const [cityValue, setCityValue] = useState("");
  const [btnSubmitted, setBtnSubmitted] = useState(false);
  // const [cities, setCities] = useState(undefined);

  //#region /===> Functions <===/

  function ClickCheckbox(event) {
    let checkLabel = document.getElementById("checkLabel");
    if (event.target.checked) {
      checkLabel.classList.add("active");
    } else {
      checkLabel.classList.remove("active");
    }
    if (agreementErrText === event.target.checked) {
      setValidateAgreement(false);
    } else {
      setValidateAgreement(true);
    }
  }

  function OnChange(event, validationSet, textError) {
    if (event.target.value != textError) {
      validationSet(true);
    } else {
      validationSet(false);
    }
  }

  function OnChangeSelect(newValue, setValue, validationSet, textError) {
    let value = newValue?.value ?? "";
    setValue(value);
    if (value != textError) {
      validationSet(true);
    } else {
      validationSet(false);
    }
  }

  async function SubmitRegistrationForm(event) {
    event.preventDefault();
    setBtnSubmitted(true);

    //#region /====> Variables <====/

    let userName = document.getElementById("userName").value;
    let userNameError = document.getElementById("userNameError");
    userNameError.innerHTML = "";

    let name = document.getElementById("name").value;
    let nameError = document.getElementById("nameError");
    nameError.innerHTML = "";

    let surname = document.getElementById("surname").value;
    let surnameError = document.getElementById("surnameError");
    surnameError.innerHTML = "";

    let middleName = document.getElementById("middleName").value;
    let middleNameError = document.getElementById("middleNameError");
    middleNameError.innerHTML = "";

    let email = document.getElementById("email").value;
    let emailError = document.getElementById("emailError");
    emailError.innerHTML = "";

    let password = document.getElementById("password").value;
    let passwordError = document.getElementById("passwordError");
    passwordError.innerHTML = "";

    let confirmPassword = document.getElementById("confirmPassword").value;
    let confirmPasswordError = document.getElementById("confirmPasswordError");
    confirmPasswordError.innerHTML = "";

    let phoneNumber = document.getElementById("phoneNumber").value;
    let phoneNumberError = document.getElementById("phoneNumberError");
    phoneNumberError.innerHTML = "";

    //cityValue
    let cityError = document.getElementById("cityError");
    cityError.innerHTML = "";

    let fileImage = document.getElementById("file").files[0] ?? null;
    let file = null;
    if (fileImage !== null) {
      file = new FormData();
      file.append("formFile", fileImage, new Date().toISOString());
    }

    let agreement = document.getElementById("agreement").checked;
    let agreementError = document.getElementById("agreementError");
    agreementError.innerHTML = "";

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
    if (name.length === 0) {
      hasError = true;
      setValidateName(false);
      setNameErrText(name);
      nameError.innerHTML += getErrorHTML("Name is empty!");
    } else {
      setNameErrText(null);
    }
    if (surname.length === 0) {
      hasError = true;
      setValidateSurname(false);
      setSurnameErrText(surname);
      surnameError.innerHTML += getErrorHTML("Surname is empty!");
    } else {
      setSurnameErrText(null);
    }
    if (middleName.length === 0) {
      hasError = true;
      setValidateMiddleName(false);
      setMiddleNameErrText(surname);
      middleNameError.innerHTML += getErrorHTML("Middle name is empty!");
    } else {
      setMiddleNameErrText(null);
    }
    if (!String(email).toLowerCase().match(regexEmailString)) {
      hasError = true;
      setValidateEmail(false);
      setEmailErrText(email);
      if (email.length === 0) {
        emailError.innerHTML += getErrorHTML("Email is empty!");
      } else {
        emailError.innerHTML += getErrorHTML("Email is wrong!");
      }
    } else {
      setEmailErrText(null);
    }
    let passWrong = false;
    if (password.length < 8) {
      passWrong = true;
      passwordError.innerHTML += getErrorHTML(
        "Minimum password length 8 characters"
      );
    } else if (password.length > 16) {
      passWrong = true;
      passwordError.innerHTML += getErrorHTML(
        "Maximum password length 16 characters"
      );
    }
    if (!String(password).match(regexPasswordString)) {
      passWrong = true;
      passwordError.innerHTML += getErrorHTML(
        "Password wrong format 1-Upper symbol 1-lower symbol 1-(#?!@$%^&*-) 1-Number"
      );
    }
    if (passWrong) {
      hasError = true;
      setValidatePassword(false);
    }
    if (confirmPassword != password) {
      setValidateConfirmPassword(false);
      confirmPasswordError.innerHTML += getErrorHTML(
        "Not equal to main password!"
      );
    }
    let phoneWrong = false;
    if (phoneNumber.length === 0) {
      phoneWrong = true;
      phoneNumberError.innerHTML += getErrorHTML("Phone number is empty!");
    } else if (!String(phoneNumber).match(regexPhoneString)) {
      phoneWrong = true;
      phoneNumberError.innerHTML += getErrorHTML("Phone number is wrong!");
    }
    if (phoneWrong) {
      hasError = true;
      setValidatePhoneNumber(false);
      setPhoneNumberErrText(phoneNumber);
    } else {
      setPhoneNumberErrText(null);
    }

    if (cityValue.length === 0) {
      hasError = true;
      setValidateCity(false);
      setCityErrText(cityValue);
      cityError.innerHTML += getErrorHTML("City is empty!");
    } else {
      setCityErrText(null);
    }

    if (!(agreement === true)) {
      hasError = true;
      setValidateAgreement(false);
      setAgreementErrText(agreement);
      agreementError.innerHTML += getErrorHTML("You must agree");
    }

    //#endregion

    if (hasError) {
      setBtnSubmitted(false);
      return;
    }

    let data = new FormData();
    data.append("userName", userName);
    data.append("name", name);
    data.append("surname", surname);
    data.append("middleName", middleName);
    data.append("email", email);
    data.append("phoneNumber", phoneNumber);
    data.append("city", cityValue);
    data.append("password", password);
    data.append("passwordConfirm", confirmPassword);
    if (fileImage !== null) {
      data.append("formFile", fileImage, fileImage.name);
    }
    try {
      let response = await fetch(
        `${serverPath}/api/Authentication/registration`,
        {
          method: "POST",
          body: data,
        }
      );
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

        if (errors["UserName"] !== undefined) {
          setValidateUserName(false);
          setUserNameErrText(userName);
          userNameError.innerHTML = getErrorsHTML(errors["UserName"]);
        }
        if (errors["Name"] !== undefined) {
          setValidateName(false);
          setNameErrText(name);
          nameError.innerHTML = getErrorsHTML(errors["Name"]);
        }
        if (errors["Surname"] !== undefined) {
          setValidateSurname(false);
          setSurnameErrText(surname);
          surnameError.innerHTML = getErrorsHTML(errors["Surname"]);
        }
        if (errors["MiddleName"] !== undefined) {
          setValidateMiddleName(false);
          setMiddleNameErrText(middleName);
          middleNameError.innerHTML = getErrorsHTML(errors["MiddleName"]);
        }
        if (errors["Email"] !== undefined) {
          setValidateEmail(false);
          setEmailErrText(email);
          emailError.innerHTML = getErrorsHTML(errors["Email"]);
        }
        if (errors["Password"] !== undefined) {
          setValidatePassword(false);
          passwordError.innerHTML = getErrorsHTML(errors["Password"]);
        }
        if (errors["PasswordConfirm"] !== undefined) {
          setValidateConfirmPassword(false);
          confirmPasswordError.innerHTML = getErrorsHTML(
            errors["PasswordConfirm"]
          );
        }
        if (errors["PhoneNumber"] !== undefined) {
          setValidatePhoneNumber(false);
          setPhoneNumberErrText(phoneNumber);
          phoneNumberError.innerHTML = getErrorsHTML(errors["PhoneNumber"]);
        }
        if (errors["City"] !== undefined) {
          setValidateCity(false);
          setCityErrText(cityValue);
          cityError.innerHTML = getErrorsHTML(errors["City"]);
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

    //#region /====> Functions in SubmitRegistrationForm <====/

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
    <div id="signUp" className="back-image">
      <div id="InputValid" className="container max-w-600">
        <div className="row">
          <div className="white-block">
            <div className="user-account">
              <h2 className="text-center">Create a Trade Account</h2>
              <form onSubmit={SubmitRegistrationForm}>
                {/* UserName */}
                <div
                  className={"form-item" + (validateUserName ? "" : " error")}
                >
                  <input
                    type="text"
                    className={
                      inputClasses + (validateUserName ? "" : " exception")
                    }
                    placeholder="User name"
                    id="userName"
                    onChange={(event) =>
                      OnChange(event, setValidateUserName, userNameErrText)
                    }
                  />
                  <div
                    id="userNameError"
                    className="errorMessage"
                    style={{ display: validateUserName ? "none" : "" }}
                  ></div>
                </div>

                {/* Name */}
                <div className={"form-item" + (validateName ? "" : " error")}>
                  <input
                    type="text"
                    className={
                      inputClasses + (validateName ? "" : " exception")
                    }
                    placeholder="Name"
                    id="name"
                    onChange={(event) =>
                      OnChange(event, setValidateName, nameErrText)
                    }
                  />
                  <div
                    id="nameError"
                    className="errorMessage"
                    style={{ display: validateName ? "none" : "" }}
                  ></div>
                </div>

                {/* Surname */}
                <div
                  className={"form-item" + (validateSurname ? "" : " error")}
                >
                  <input
                    type="text"
                    className={
                      inputClasses + (validateSurname ? "" : " exception")
                    }
                    placeholder="Surname"
                    id="surname"
                    onChange={(event) =>
                      OnChange(event, setValidateSurname, surnameErrText)
                    }
                  />
                  <div
                    id="surnameError"
                    className="errorMessage"
                    style={{ display: validateSurname ? "none" : "" }}
                  ></div>
                </div>

                {/* Middle name */}
                <div
                  className={"form-item" + (validateMiddleName ? "" : " error")}
                >
                  <input
                    type="text"
                    className={
                      inputClasses + (validateMiddleName ? "" : " exception")
                    }
                    placeholder="Middle name"
                    id="middleName"
                    onChange={(event) =>
                      OnChange(event, setValidateMiddleName, middleNameErrText)
                    }
                  />
                  <div
                    id="middleNameError"
                    className="errorMessage"
                    style={{ display: validateMiddleName ? "none" : "" }}
                  ></div>
                </div>

                {/* Email */}
                <div className={"form-item" + (validateEmail ? "" : " error")}>
                  <input
                    type="text"
                    className={
                      inputClasses + (validateEmail ? "" : " exception")
                    }
                    placeholder="E-mail"
                    id="email"
                    onChange={(event) =>
                      OnChange(event, setValidateEmail, emailErrText)
                    }
                  />
                  <div
                    id="emailError"
                    className="errorMessage"
                    style={{ display: validateEmail ? "none" : "" }}
                  ></div>
                </div>

                {/* Password */}
                <div
                  className={"form-item" + (validatePassword ? "" : " error")}
                >
                  <input
                    type="password"
                    className={
                      inputClasses + (validatePassword ? "" : " exception")
                    }
                    placeholder="Password"
                    id="password"
                    onChange={(event) =>
                      OnChange(event, setValidatePassword, null)
                    }
                  />
                  <div
                    id="passwordError"
                    className="errorMessage"
                    style={{ display: validatePassword ? "none" : "" }}
                  ></div>
                </div>

                {/* Confirm Password */}
                <div
                  className={
                    "form-item" + (validateConfirmPassword ? "" : " error")
                  }
                >
                  <input
                    type="password"
                    className={
                      inputClasses +
                      (validateConfirmPassword ? "" : " exception")
                    }
                    placeholder="Confirm Password"
                    id="confirmPassword"
                    onChange={(event) =>
                      OnChange(event, setValidateConfirmPassword, null)
                    }
                  />
                  <div
                    id="confirmPasswordError"
                    className="errorMessage"
                    style={{ display: validateConfirmPassword ? "none" : "" }}
                  ></div>
                </div>

                {/* Mobile Number */}
                <div
                  className={
                    "form-item" + (validatePhoneNumber ? "" : " error")
                  }
                >
                  <input
                    type="text"
                    className={
                      inputClasses + (validatePhoneNumber ? "" : " exception")
                    }
                    placeholder="Mobile Number"
                    id="phoneNumber"
                    onChange={(event) =>
                      OnChange(
                        event,
                        setValidatePhoneNumber,
                        phoneNumberErrText
                      )
                    }
                  />
                  <div
                    id="phoneNumberError"
                    className="errorMessage"
                    style={{ display: validatePhoneNumber ? "none" : "" }}
                  ></div>
                </div>

                {/* City */}
                <div className={"form-item" + (validateCity ? "" : " error")}>
                  <Select
                    className={
                      "input-react-select" + (validateCity ? "" : " exception")
                    }
                    isMulti={false}
                    options={cities}
                    onChange={(newValue) =>
                      OnChangeSelect(
                        newValue,
                        setCityValue,
                        setValidateCity,
                        cityErrText
                      )
                    }
                    placeholder="Select city"
                    isLoading={cities === undefined ? true : false}
                    isClearable={true}
                    isSearchable={true}
                  />
                  <div
                    id="cityError"
                    className="errorMessage"
                    style={{ display: validateCity ? "none" : "" }}
                  ></div>
                </div>

                {/* File */}
                <label className="grey-label">Profile photo:</label>
                <input
                  className="form-control reg-file-input"
                  type={"file"}
                  accept={"image/*"}
                  id="file"
                />

                <div className="user-option text-center">
                  <div
                    className={
                      "checkbox-label" +
                      (validateAgreement ? "" : " border border-danger")
                    }
                  >
                    <label id="checkLabel" className="" htmlFor="agreement">
                      <input
                        id="agreement"
                        type="checkbox"
                        name="signing"
                        className="mx-1"
                        onClick={ClickCheckbox}
                      />
                      By signing up for an account you agree to our Terms and
                      Conditions
                    </label>
                  </div>
                  <div
                    id="agreementError"
                    className="errorMessage"
                    style={{ display: validateAgreement ? "none" : "" }}
                  ></div>
                  {/* <ButtonLoading
                    submitted={btnSubmitted}
                    text={"Registration"}
                  /> */}
                  <div
                    id="responseError"
                    className="errorMessage"
                    style={{ display: validateResponse ? "none" : "" }}
                  ></div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
