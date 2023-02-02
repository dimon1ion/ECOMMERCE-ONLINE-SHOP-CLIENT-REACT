import s from "./CheckBox.module.scss";


export default function CheckBox({ children, checked, setChecked }) {

  return (
    <label>
      <input
        type="checkbox"
        className={`mx-1 ${setChecked && s["active"]}`}
        onChange={() => setChecked(state => !state)}
        checked={checked}
      />
      {children}
    </label>
  );
}
