import s from "./Banner.module.scss";
import securityIcon from "../../assets/Images/security_icon.svg";
import marketIcon from "../../assets/Images/market__shop_icon.svg";

export default function Banner(props){
    return(
        <>
          <div className="d-flex flex-column align-items-center">
            <img
              src={securityIcon}
              className={s["banner__image"]}
              alt=""
            />
            <h4 className={s["banner__title"]}>
              Secure shopping
            </h4>
            <p className={s["banner__comment"]}>
              Your data is always private
            </p>
          </div>
          <div className="d-flex flex-column align-items-center">
            <img
              src={marketIcon}
              className={s["banner__image"]}
              alt=""
            />
            <h4 className={s["banner__title"]}>
              Easy to use
            </h4>
            <p className={s["banner__comment"]}>
              Intuitive interface for all ages
            </p>
          </div>
          <div className="d-flex flex-column align-items-center">
            <h4 className={s["banner__title_help"]}>
              Need help?
            </h4>
            <p className={s["banner__comment"]}>
              Give a call on +994(55)873-23-12
            </p>
          </div>
        </>
    )
}