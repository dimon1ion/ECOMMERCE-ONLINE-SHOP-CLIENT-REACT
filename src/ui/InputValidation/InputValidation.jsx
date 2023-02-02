import ErrorMessage from "../ErrorMessage/ErrorMessage";
import s from "./InputValidation.module.scss";

export default function InputValidation({
  inputValue,
  setInputValue,
  validateValue,
  setValidateValue,
  errorValue,
  errorText,
  placeholder,
  type = "text"
}) {

  const handleChange = ({ target: { value } }) => {
    setInputValue(value);
    if (value !== errorValue) {
      setValidateValue(true);
    } else {
      setValidateValue(false);
    }
  };

  return (
    <div className={s["m-bottom"]}>
      <input
        type={type}
        className={`form-control ${s["form-input"]} ${
          validateValue ? "" : s["exception"]
        }`}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
      />
      <ErrorMessage show={validateValue}>{errorText}</ErrorMessage>
    </div>
  );

}
