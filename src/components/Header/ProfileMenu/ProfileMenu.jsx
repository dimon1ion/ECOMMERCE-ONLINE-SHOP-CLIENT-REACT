// import { GetProfileFromCookie } from "../Store/functions";
import { Text, Avatar, Dropdown } from "@nextui-org/react";
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AuthenticationContext from "../../../contexts/Authentication.context";
import ServerPath from "../../../enums/ServerPath";
import useAuthentication from "../../../hooks/useAuthentication";
import s from "./ProfileMenu.module.scss";

export default function ProfileMenu() {
  // const profile = GetProfileFromCookie(serverPath);
  const { isAuthenticated, getInitials, emailUser, logOut } = useContext(AuthenticationContext);
  const navigate = useNavigate();


  const activeLink = ({ isActive }) =>
    `nav-link ${s["nav-link"]} ${isActive ? s["active"] : ""}`;

  const avatarAction = (actionKey) => {
    switch (actionKey) {
      case "cart":
        navigate("/profile/cart");
        break;
        case "history":
        navigate("/profile/history");
        break;
      case "logout":
        logOut();
        navigate("/login");
        break;
      case "changeAcc":
        navigate("/login");
        break;
      case "profile":
      case "profile2":
      navigate("/profile");
      break;
      case "settings":
        navigate("/profile/details");
        break;
      default:
        break;
    }
  }
    
  if (isAuthenticated === true) {
    return (
      <>
      <li className="d-flex nav-item align-items-center ps-md-4">
        {/* <NavLink to={"/sign-in"} className={({ isActive }) => `btn ${s["my-btn-primary"]} ${(isActive ? s["active-btn"] : "")}`}>
          Change Profile
        </NavLink>
        <NavLink to={`/${profile.name}`} >
          <img src={profile.Thumbnail} className={s["thumbnail"]}/>
        </NavLink> */}
        <Dropdown placement="bottom-right">
            <Dropdown.Trigger>
              <Avatar
                bordered
                as="button"
                color="gradient"
                textColor="white"
                size="md"
                // src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                text={getInitials()}
              />
            </Dropdown.Trigger>
          <Dropdown.Menu
            aria-label="User menu actions"
            color="success"
            onAction={avatarAction}
          >
            <Dropdown.Item key="profile" css={{ height: "$18" }}>
              <Text b color="inherit" css={{ d: "flex" }}>
                Signed in as
              </Text>
              <Text b color="inherit" css={{ d: "flex" }}>
                {emailUser}
              </Text>
            </Dropdown.Item>
            <Dropdown.Item key="profile2" withDivider>
              Profile
            </Dropdown.Item>
            <Dropdown.Item key="settings">
              My Settings
            </Dropdown.Item>
            <Dropdown.Item key="cart" withDivider>
              Cart
            </Dropdown.Item>
            <Dropdown.Item key="history">
              Order history
            </Dropdown.Item>
            {/* <Dropdown.Item key="system">System</Dropdown.Item> */}
            {/* <Dropdown.Item key="configurations">Configurations</Dropdown.Item> */}
            {/* <Dropdown.Item key="help_and_feedback" withDivider>
              Help & Feedback
            </Dropdown.Item> */}
            <Dropdown.Item key="changeAcc" withDivider color="secondary">
              Change Account
            </Dropdown.Item>
            <Dropdown.Item key="logout" color="error">
              Log Out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
       </li>
      </>
    );
  }
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
      <NavLink to={"/login"} className={activeLink}>
        LOGIN
      </NavLink>
      <span>/</span>
      <NavLink to={"/registration"} className={activeLink}>
        REQISTER
      </NavLink>
    </li>
  );
}
