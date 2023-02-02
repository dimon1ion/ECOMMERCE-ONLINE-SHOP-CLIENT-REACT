import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/Images/logo.png";

import s from "./Header.module.scss";
import ProfileMenu from "./ProfileMenu";
// import ProfileMenu from "./ProfileMenu";

export default function Header(params) {
  function scrollUp() {
    let scrollup = document.getElementById(s["scrollup"]);
    if (+window.scrollY >= 20) {
      scrollup.classList.add(s["show-scrollup"]);
    } else {
      scrollup.classList.remove(s["show-scrollup"]);
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", scrollUp);
    return () => {
      window.removeEventListener("scroll", scrollUp);
    }
  }, []);

  const activeLink = ({ isActive }) => `nav-link ${s["nav-link"]} ${(isActive ? s["active"] : "")}`;

  function changeColor() {
    document.documentElement.style.setProperty("--default-color", "#eb3434");
  }

  return (
    <header id="head" >
      <nav className={`navbar navbar-expand-md ${s["navbar-lightGreen"]}`}>
        <div className="container">
          <NavLink to={"/"} replace className={s["navbar-brand"]}>
            <img src={logo} alt="Trade" />
          </NavLink>
          <button
            className={`navbar-toggler ${s["navbar-toggler"]}`}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className={`navbar-toggler-icon ${s["navbar-toggler-icon"]}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="rgba(0, 166, 81, 1)"
                  strokeLinecap="round"
                  strokeMiterlimit={"10"}
                  strokeWidth="2"
                  d="M4 7h22M4 15h22M4 23h22"
                />
              </svg>
            </span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className={`d-flex navbar-nav ${s["navbar-nav"]} flex-grow-1 justify-content-end ${s["fw-500"]}`}>
              <li className="nav-item">
                <NavLink to={""} className={activeLink}>
                  HOME
                </NavLink>
              </li>
              <li className="nav-item ps-md-4">
                <NavLink to={"/categories"} className={activeLink}>
                PRODUCT CATEGORIES
                </NavLink>
              </li>
              <li className="nav-item ps-md-4">
                <NavLink to={"/FAQ"} className={activeLink}>
                  FAQ
                </NavLink>
              </li>
              <ProfileMenu />
            </ul>
          </div>
        </div>
      </nav>
      <a id={s["scrollup"]} href="#head"></a>
    </header>
  );
}
