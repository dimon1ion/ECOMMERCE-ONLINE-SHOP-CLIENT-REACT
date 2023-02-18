import s from "./NotFound.module.scss";
import backImage from "../../assets/styles/backImage.module.scss";

export default function NotFound(params) {
  return (
    <>
      <div
        className={`${backImage["back-image"]} ${s["cart"]} ${s["white-block"]} d-flex justify-content-center align-items-center`}
      >
            <h1 className={s["error"]}>Not found 404</h1>
      </div>
    </>
  );
}
