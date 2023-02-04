import { NavLink } from "react-router-dom";
import s from "./ViewProduct.module.scss";

export default function ViewProduct({ id, price, name, category, date }) {
  return (
    <>
      <NavLink to={1} className={s["navlink"]}>
        <div className="row">
          <div
            className={`${s["ad-image"]} ${s["item-image"]} col-12 col-md-5 col-lg-4`}
          >
            <img
              src="https://demo.themeregion.com/trade/images/listing/1.jpg"
              alt="Samsung Galaxy S6 Edge"
            />
          </div>
          <div className="col">
            <div className={s["info"]}>
              <h5>$380.00</h5>
              <span className={s["product-name"]}>Samsung Galaxy S6 Edge</span>
              <div className={s["product-categorie"]}>
                <span>Electronics & Gedgets</span>
              </div>
            </div>
            <div className={`${s["additionally"]} d-none ${s["w-larger"]}`}>
              <div className={`${s["left-icons"]} d-flex`}>
                <span>7 Jan 10:10 pm</span>
                {/* <span className={s["tags"]}>Used</span> */}
              </div>
              {/* <div className={s["icons"]}>
                                          <span href="#" className={s["nav-icon"]} title="Los Angeles"></span>
                                          <span href="#" className={s["individual"]} title="Individual"></span>
                                        </div> */}
            </div>
          </div>
          <div className={`${s["additionally"]} col-12 ${s["w-smaller"]}`}>
            <div className={`${s["left-icons"]} d-flex`}>
              <span href="#">7 Jan 10:10 pm</span>
            </div>
          </div>
        </div>
      </NavLink>
    </>
  );
}
