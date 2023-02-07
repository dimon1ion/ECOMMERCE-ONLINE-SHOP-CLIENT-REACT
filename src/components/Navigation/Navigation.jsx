import { NavLink } from "react-router-dom";
import s from "./Navigation.module.scss";

export default function Navigation({ navigationArr, defaultTitle }) {

  return (
    <>
      {/* <nav className={s["navigation"]}>
            <ul>
              <li>
                <NavLink to={"/home"}>Home</NavLink>
              </li>
              <li>{selectedCategory}</li>
            </ul>
            <h2 className={`${s["name-categorie"]} headerCategory`}>
              Category{" "}
            </h2>
          </nav> */}
      <nav className={s["navigation"]}>
        <ul>
          {navigationArr.map(({ name, ref }) => (
            <li key={name + "navig"}>
              {ref ? <>{name}</> : <NavLink to={ref}>{name}</NavLink>}
            </li>
          ))}
        </ul>
        <h2 className={`${s["name-categorie"]}`}>
          {navigationArr.length - 1 >= 0 ? (
            <>{navigationArr[navigationArr.length - 1].name}</>
          ) : (
            <>{defaultTitle}</>
          )}
        </h2>
      </nav>
    </>
  );
}
