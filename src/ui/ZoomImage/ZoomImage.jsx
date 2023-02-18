import useToggle from "../../hooks/useToggle";
import s from "./ZoomImage.module.scss";

export default function ZoomImage({src, alt = "", className = ""}) {
  const { isOpen:isZoomed, toggle } = useToggle(false);

  return (
    <span className={`${isZoomed ? s["zoom_block"] : ""} ${s["block"]}`} onClick={toggle}>
      <img
        src={src}
        alt={alt}
        className={isZoomed ? "" : className}
      />
    </span>
  );
}
