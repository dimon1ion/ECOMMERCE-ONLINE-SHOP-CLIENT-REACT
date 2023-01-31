import { GetProfileFromCookie } from "../Store/functions";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import s from "../Header.module.scss";


export default function ProfileMenu() {
    const serverPath = useSelector((state) => state.server.path);
    const profile = GetProfileFromCookie(serverPath);
    const activeLink = ({ isActive }) => s["nav-link"] + " " + (isActive ? s["active"] : "");
    if (profile !== null) {
      return (
        <li className="d-flex nav-item align-items-center ps-md-4">
        <NavLink to={"/sign-in"} className={({ isActive }) => `btn ${s["my-btn-primary"]} ${(isActive ? s["active-btn"] : "")}`}>
          Change Profile
        </NavLink>
        <NavLink to={`/${profile.name}`} >
          <img src={profile.Thumbnail} className={s["thumbnail"]}/>
        </NavLink>
      </li>
      );
    } else {
      return (
        <li className="d-flex nav-item align-items-center ps-md-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
          >
            <title />
            <circle cx="12" cy="8" fill="#00a651" r="4" />
            <path
              d="M20,19v1a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V19a6,6,0,0,1,6-6h4A6,6,0,0,1,20,19Z"
              fill="#00a651"
            />
          </svg>
          {/* <img classNameн="user-ico" src="images/user-ico.svg" /> */}
          <NavLink to={"/sign-in"} className={activeLink}>
            SIQN IN
          </NavLink>
          <span>/</span>
          <NavLink to={"/sign-up"} className={activeLink}>
            REQISTER
          </NavLink>
        </li>
      );
    }
  }