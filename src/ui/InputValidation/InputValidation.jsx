import ErrorMessage from "../ErrorMessage/ErrorMessage";
import s from "./InputValidation.module.scss";

export default function InputValidation({
  inputValue,
  setInputValue,
  validateValue,
  setValidateValue,
  errorText,
  placeholder,
  type = "text"
}) {

  const handleChange = ({ target: { value } }) => {
    setInputValue(value);
    if (value != errorText) {
      setValidateValue(true);
    } else {
      setValidateValue(false);
    }
  };

  return (
    <>
      <input
        type={type}
        className={`form-control ${s["form-input"]} ${
          validateValue ? "" : " exception"
        }`}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
      />
      <ErrorMessage show={validateValue} errorText={errorText} />
    </>
  );

}
