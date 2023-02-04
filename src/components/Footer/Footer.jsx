import facebook from "../../assets/Images/facebook.png"
import google from "../../assets/Images/google+.png";
import twitter from "../../assets/Images/twitter.png";
import youtube from "../../assets/Images/youtube.png";
import s from "./Footer.module.scss";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import AuthenticationContext from "../../contexts/Authentication.context";

export default function Footer(props) {

  const { isAuthenticated } = useContext(AuthenticationContext);

  return (
    <footer>
      <div className={s["white-block"]}>
        <div className="container">
          <div className="row">
            <div className="col-md-3 col-sm-6">
              <h3>Quik Links</h3>
              <ul>
                <li>
                  <NavLink to={"/faq"}>About us</NavLink>
                </li>
                <li>
                  <NavLink to={"/soon"}>Contact us</NavLink>
                </li>
                <li>
                  <NavLink to={"/soon"}>Careers</NavLink>
                </li>
                <li>
                  <NavLink to={"/soon"}>All Cities</NavLink>
                </li>
                <li>
                  <NavLink to={"/soon"}>Help & Support</NavLink>
                </li>
                <li>
                  <NavLink to={"/soon"}>Advertise With Us</NavLink>
                </li>
                <li>
                  <NavLink to={"/soon"}>Blogs</NavLink>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-6">
              <h3>How to sell fast</h3>
              <ul>
                <li>
                  <NavLink to={"/soon"}>How To Sell Fast</NavLink>
                </li>
                <li>
                  <NavLink to={"/soon"}>Membership</NavLink>
                </li>
                <li>
                  <NavLink to={"/soon"}>Banner Advertising</NavLink>
                </li>
                <li>
                  <NavLink to={"/soon"}></NavLink>
                </li>
                <li>
                  <NavLink to={"/soon"}>Trade Delivers</NavLink>
                </li>
                <li>
                  <NavLink to={"/faq"}>FAQ</NavLink>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-6">
              <h3>Follow us on</h3>
              <ul className={s["social"]}>
                <li>
                  <NavLink to={"/soon"}>
                    <img className="mx-1" src={facebook} />
                    Facebook
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/soon"}>
                    <img className="mx-1" src={twitter} />
                    Twitter
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/soon"}>
                    <img className="mx-1" src={google} />
                    Google+
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/soon"}>
                    <img className="mx-1" src={youtube} />
                    Youtube
                  </NavLink>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-6">
              <h3>Newsletter</h3>
              <p>Trade is Worldest leading classifieds platform that brings!</p>
              { isAuthenticated || <NavLink to={"/registration"} className={`btn ${s["btn"]} ${s["btn-green"]} mt-2`}>
                  Sign Up
              </NavLink>}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
