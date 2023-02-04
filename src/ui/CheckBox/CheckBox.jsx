import s from "./CheckBox.module.scss";


export default function CheckBox({ children, checked, setChecked, onChange = undefined }) {

  const handleChange = () => {
    setChecked(state => !state);
    if (onChange !== undefined) {
      onChange();
    }
  }

  return (
    <label className={s["unselect"]}>
      <input
        type="checkbox"
        className={`mx-1 ${setChecked && s["active"]}`}
        onChange={handleChange}
        checked={checked}
      />
      {children}
    </label>
  );
}
