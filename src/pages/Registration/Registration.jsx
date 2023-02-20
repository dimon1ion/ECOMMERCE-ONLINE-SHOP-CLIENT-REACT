import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputValidation from "../../ui/InputValidation";
import CheckBox from "../../ui/CheckBox";
import ErrorMessage from "../../ui/ErrorMessage";
import ButtonLoad from "../../ui/ButtonLoad";
import s from "./Registration.module.scss";
import backImage from "../../assets/styles/backImage.module.scss";
import ServerPath from "../../enums/ServerPath";
import Token from "../../enums/Token";
import postRequest from "../../requests/postRequest";
import jwtDecode from "jwt-decode";
import { Modal, useModal, Button, Text } from "@nextui-org/react";
import confetti from "canvas-confetti";
import AuthenticationContext from "../../contexts/Authentication.context";

export default function Registration() {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const { isAuthenticated } = useContext(AuthenticationContext);

  useEffect(() => {
    console.log(isAuthenticated);
    if (isAuthenticated) {
      navigate("/notfound");
    }
  }, [isAuthenticated]);

  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
  };
  const fire = (particleRatio, opts) => {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  };
  const fireVisible = () => {
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const { setVisible, bindings } = useModal();

  //#region /====> For use in code <====/

  const regexEmailString =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const regexPasswordString =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  const regexPhoneString =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

  //#endregion

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [agreement, setAgreement] = useState(false);

  //#region /====> ErrorText When was Submit <====/

  const [nameErrValue, setNameErrValue] = useState(null);
  const [surnameErrValue, setSurnameErrValue] = useState(null);
  const [middleNameErrValue, setMiddleNameErrValue] = useState(null);
  const [emailErrValue, setEmailErrValue] = useState(null);
  const [passwordErrValue, setPasswordErrValue] = useState(null);
  const [phoneNumberErrValue, setPhoneNumberErrValue] = useState(null);

  const [nameErrText, setNameErrText] = useState(null);
  const [surnameErrText, setSurnameErrText] = useState(null);
  const [middleNameErrText, setMiddleNameErrText] = useState(null);
  const [emailErrText, setEmailErrText] = useState(null);
  const [passwordErrText, setPasswordErrText] = useState(null);
  const [confirmPasswordErrText, setConfirmPasswordErrText] = useState(null);
  const [phoneNumberErrText, setPhoneNumberErrText] = useState(null);
  const [agreementErrText, setAgreementErrText] = useState(null);
  const [responseErrText, setResponseErrText] = useState(null);

  //#endregion

  //#region /===> Valid input: True or False <====/

  const [validateName, setValidateName] = useState(true);
  const [validateSurname, setValidateSurname] = useState(true);
  const [validateMiddleName, setValidateMiddleName] = useState(true);
  const [validateEmail, setValidateEmail] = useState(true);
  const [validatePassword, setValidatePassword] = useState(true);
  const [validateConfirmPassword, setValidateConfirmPassword] = useState(true);
  const [validatePhoneNumber, setValidatePhoneNumber] = useState(true);
  const [validateAgreement, setValidateAgreement] = useState(true);
  const [validateResponse, setValidateResponse] = useState(true);

  //#endregion

  //Input Values
  const [btnSubmitted, setBtnSubmitted] = useState(false);

  //#region /===> Functions <===/

  const SubmitRegistrationForm = async (event) => {
    event.preventDefault();
    setBtnSubmitted(true);
    setValidateResponse(true);
    let hasError = false;

    // let fileImage = document.getElementById("file").files[0] ?? null;
    // let file = null;
    // if (fileImage !== null) {
    //   file = new FormData();
    //   file.append("formFile", fileImage, new Date().toISOString());
    // }

    //#region /====> WEB Validate <====/

    if (name.trim().length === 0) {
      hasError = true;
      setValidateName(false);
      setNameErrValue(name);
      setNameErrText("Name is empty!");
    } else {
      setNameErrValue(null);
    }
    if (surname.trim().length === 0) {
      hasError = true;
      setValidateSurname(false);
      setSurnameErrValue(surname);
      setSurnameErrText("Surname is empty!");
    } else {
      setSurnameErrValue(null);
    }
    if (!String(email).trim().toLowerCase().match(regexEmailString)) {
      hasError = true;
      setValidateEmail(false);
      setEmailErrValue(email);
      if (email.length === 0) {
        setEmailErrText("Email is empty!");
      } else {
        setEmailErrText("Email is wrong format!");
      }
    } else {
      setEmailErrValue(null);
    }

    let passWrong = false;
    const cleanPassword = password.trim();

    if (cleanPassword.length < 8) {
      passWrong = true;
      setPasswordErrText("Minimum password length 8 characters");
    } else if (cleanPassword.length > 16) {
      passWrong = true;
      setPasswordErrText("Maximum password length 16 characters");
    }
    if (!String(cleanPassword).match(regexPasswordString)) {
      passWrong = true;
      setPasswordErrText(
        "Password wrong format 1-Upper symbol 1-lower symbol 1-(#?!@$%^&*-) 1-Number"
      );
    }
    if (passWrong) {
      hasError = true;
      setValidatePassword(false);
      setPasswordErrValue(password);
    } else {
      setPasswordErrValue(null);
    }
    if (confirmPassword.trim() !== cleanPassword) {
      setValidateConfirmPassword(false);
      setConfirmPasswordErrText("Not equal to main password!");
    }

    let phoneWrong = false;
    const cleanPhone = phoneNumber.trim();

    if (cleanPhone.length === 0) {
      phoneWrong = true;
      setPhoneNumberErrText("Phone number is empty!");
    } else if (!String(cleanPhone).match(regexPhoneString)) {
      phoneWrong = true;
      setPhoneNumberErrText("Phone number is wrong!");
    }
    if (phoneWrong) {
      hasError = true;
      setValidatePhoneNumber(false);
      setPhoneNumberErrValue(phoneNumber);
    } else {
      setPhoneNumberErrValue(null);
    }

    if (agreement !== true) {
      hasError = true;
      setValidateAgreement(false);
      setAgreementErrText("You must agree");
    }

    //#endregion

    if (hasError) {
      setBtnSubmitted(false);
      return;
    }

    // let data = new FormData();
    // data.append("userName", userName);
    // data.append("name", name);
    // data.append("surname", surname);
    // data.append("middleName", middleName);
    // data.append("email", email);
    // data.append("phoneNumber", phoneNumber);
    // data.append("city", cityValue);
    // data.append("password", password);
    // data.append("passwordConfirm", confirmPassword);
    // if (fileImage !== null) {
    //   data.append("formFile", fileImage, fileImage.name);
    // }
    let data = {
      firstName: name,
      lastName: surname,
      email,
      password,
      passwordConfirmation: confirmPassword,
      phoneNumber,
    };
    if (middleName.trim().length !== 0) {
      data.middleName = middleName;
    }
    const response = await postRequest(
      `${ServerPath.SERVERPATH}${ServerPath.REGISTRATION}`,
      data
    );
    if (response === null) {
      setValidateResponse(false);
      setResponseErrText(
        "Prevention is currently underway. Try again in a few minutes"
      );
      hasError = true;
    } else if (response.ok) {
      hasError = false;
    } else if (response.status === 400) {
      hasError = true;
      const errors = await response.json();
      // console.log(errors);

      //#region /====> Response Validate <====/

      if (errors["FirstName"] !== undefined) {
        setValidateName(false);
        setNameErrValue(name);
        setNameErrText(errors["FirstName"]);
      }
      if (errors["LastName"] !== undefined) {
        setValidateSurname(false);
        setSurnameErrValue(surname);
        setSurnameErrText(errors["LastName"]);
      }
      if (errors["MiddleName"] !== undefined) {
        setValidateMiddleName(false);
        setMiddleNameErrValue(middleName);
        setMiddleNameErrText(errors["MiddleName"]);
      }
      if (errors["Email"] !== undefined) {
        setValidateEmail(false);
        setEmailErrValue(email);
        setEmailErrText(errors["Email"]);
      }
      if (errors["Password"] !== undefined) {
        setValidatePassword(false);
        setPasswordErrValue(password);
        setPasswordErrText(errors["Password"]);
      }
      if (errors["PasswordConfirmation"] !== undefined) {
        setValidateConfirmPassword(false);
        setConfirmPasswordErrText(errors["PasswordConfirmation"]);
      }
      if (errors["PhoneNumber"] !== undefined) {
        setValidatePhoneNumber(false);
        setPhoneNumberErrValue(phoneNumber);
        setPhoneNumberErrText(errors["PhoneNumber"]);
      }
      if (errors["error_message"] !== undefined) {
        setValidateResponse(false);
        setResponseErrText(errors["error_message"]);
      }

      //#endregion
    } else {
      hasError = true;
    }

    if (!hasError) {
      setVisible(true);
      fireVisible();
    }
    setBtnSubmitted(false);
  };

  //#endregion

  return (
    <>
      {isAuthenticated !== undefined && (
        <div className={backImage["back-image"]}>
          <div className={`container ${s["max-w-600"]}`}>
            <div className="row">
              <div className={s["white-block"]}>
                <div className={s["user-account"]}>
                  <h2 className="text-center">Create a Trade Account</h2>
                  <form onSubmit={SubmitRegistrationForm}>
                    <InputValidation
                      inputValue={name}
                      setInputValue={setName}
                      validateValue={validateName}
                      setValidateValue={setValidateName}
                      placeholder={"Name"}
                      errorValue={nameErrValue}
                      errorText={nameErrText}
                    />
                    <InputValidation
                      inputValue={surname}
                      setInputValue={setSurname}
                      validateValue={validateSurname}
                      setValidateValue={setValidateSurname}
                      placeholder={"Surname"}
                      errorValue={surnameErrValue}
                      errorText={surnameErrText}
                    />
                    <InputValidation
                      inputValue={middleName}
                      setInputValue={setMiddleName}
                      validateValue={validateMiddleName}
                      setValidateValue={setValidateMiddleName}
                      placeholder={"middleName"}
                      errorValue={middleNameErrValue}
                      errorText={middleNameErrText}
                    />
                    <InputValidation
                      inputValue={email}
                      setInputValue={setEmail}
                      validateValue={validateEmail}
                      setValidateValue={setValidateEmail}
                      placeholder={"Email"}
                      errorValue={emailErrValue}
                      errorText={emailErrText}
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
                    <InputValidation
                      inputValue={confirmPassword}
                      setInputValue={setConfirmPassword}
                      validateValue={validateConfirmPassword}
                      setValidateValue={setValidateConfirmPassword}
                      placeholder={"Confirm password"}
                      errorValue={null}
                      errorText={confirmPasswordErrText}
                      type={"password"}
                    />
                    <InputValidation
                      inputValue={phoneNumber}
                      setInputValue={setPhoneNumber}
                      validateValue={validatePhoneNumber}
                      setValidateValue={setValidatePhoneNumber}
                      placeholder={"Mobile Number"}
                      errorValue={phoneNumberErrValue}
                      errorText={phoneNumberErrText}
                      type={"tel"}
                    />

                    {/* File */}
                    {/* <label className="grey-label">Profile photo:</label>
                <input
                  className="form-control reg-file-input"
                  type={"file"}
                  accept={"image/*"}
                  id="file"
                /> */}

                    <div className={`${s["user-option"]} text-center`}>
                      <div
                        className={`
                      ${s["checkbox-label"]} ${
                          validateAgreement ? "" : " border border-danger"
                        }`}
                      >
                        <CheckBox
                          checked={agreement}
                          setChecked={setAgreement}
                          onChange={() => setValidateAgreement(true)}
                        >
                          By signing up for an account you agree to our Terms
                          and Conditions
                        </CheckBox>
                      </div>
                      <ErrorMessage show={validateAgreement}>
                        {agreementErrText}
                      </ErrorMessage>
                      <ButtonLoad
                        submitted={btnSubmitted}
                        disabled={
                          !validateName ||
                          !validateSurname ||
                          !validateEmail ||
                          !validatePassword ||
                          !validateConfirmPassword ||
                          !validatePhoneNumber
                        }
                      >
                        Register
                      </ButtonLoad>
                      <ErrorMessage show={validateResponse}>
                        {responseErrText}
                      </ErrorMessage>
                    </div>
                  </form>
                  <Modal
                    scroll
                    width="600px"
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                    {...bindings}
                  >
                    <Modal.Header>
                      <Text id="modal-title" size={18}>
                        Registration completed successfully!
                      </Text>
                    </Modal.Header>
                    <Modal.Body>
                      <Text id="modal-description">
                        To complete your registration, please verify your email
                        address. An email has been sent to you with a
                        confirmation link.
                      </Text>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button auto onPress={() => setVisible(false)}>
                        Agree
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
