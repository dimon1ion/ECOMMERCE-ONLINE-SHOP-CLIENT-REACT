import { useState } from "react";
import s from "./RatingComponent.module.scss";

export default function RatingComponent({rating, setRating, changeable = false}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={`${s["star"]} ${changeable ? s["changeable"] : ""} ${index <= (hover || rating) ? s["on"] : s["off"]}`}
            onClick={() => changeable && setRating && setRating(index)}
            onMouseEnter={() => changeable && setHover(index)}
            onMouseLeave={() => changeable && setHover(rating)}
          >
          </button>
        );
      })}
      <span className={s["comment"]}>{rating === 0 && <>No ratings</>}</span>
    </div>
  );
}
