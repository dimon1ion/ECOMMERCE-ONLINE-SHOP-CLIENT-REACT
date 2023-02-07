import { NavLink } from "react-router-dom";
import s from "./Navigation.module.scss";

export default function Navigation({ navigationArr = [], title = "" }) {

  return (
    <>
      <nav className={s["navigation"]}>
        <ul>
          {navigationArr.map(({ name, ref }) => (
            <li key={name + "navig"}>
              {ref === undefined ? <>{name}</> : <NavLink to={ref}>{name}</NavLink>}
            </li>
          ))}
        </ul>
        <h2 className={`${s["name-categorie"]}`}>
          {navigationArr.length - 1 && title === undefined >= 0 ? (
            <>{navigationArr[navigationArr.length - 1].name}</>
          ) : (
            <>{title !== undefined && <>{title}</>}</>
          )}
        </h2>
      </nav>
    </>
  );
}
