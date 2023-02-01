import s from "./CheckBox.module.scss";


export default function CheckBox({checked, setChecked, children}) {

  return (
    <label>
      <input
        type="checkbox"
        className={`mx-1 ${setChecked && s["active"]}`}
        onClick={() => setChecked(state => !state)}
        checked={checked}
      />
      {children}
    </label>
  );
}
