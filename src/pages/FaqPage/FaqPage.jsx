import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Navigation from "../../components/Navigation/Navigation";
import backImage from "../../assets/styles/backImage.module.scss";
import s from "./FaqPage.module.scss";

export default function FaqPage(props) {
  const [navigation, setNavigation] = useState([{ name: "Home", ref: "/home" }, { name: "FAQ" }]);

  return (
    <>
      <section className={`${backImage["back-image"]} ${s["categories"]}`}>
        <div className="container">
          {/* <Navigation navigationArr={navigation} defaultTitle={"Faq"} /> */}
        </div>
      </section>
    </>
  );
}
