import { useEffect, useState } from "react";
import useToggle from "../../hooks/useToggle";
import s from "./TextMore.module.scss";

export default function TextMore({
  text,
  maxSymbols,
  showButton = false,
  maxRows = 4,
}) {
  const { isOpen, open, close } = useToggle(true);
  const [showText, setShowText] = useState("");

  useEffect(() => {
    let count = 0;
    if (text === undefined) {
        return;
    }
    setShowText(
      text
        .split("\n")
        .map((row, index) => {
          if (index < maxRows) {
            if (count + row.length <= maxSymbols) {
              count += row.length;
              return row;
            } else if (count === maxSymbols) {
              return;
            }
            const result = row.substring(0, maxSymbols - count);
            count = maxSymbols;
            return result;
          }
          close();
        })
        .filter((item) => item !== undefined && item !== "")
        .join("\n")
    );
    if (count === maxSymbols) {
        close();
    }
  }, [text]);

  return (
    <>
      {isOpen ? (
        <>{text}</>
      ) : (
        <>
          {showText}...
          {showButton && (
            <div>
              <button className={s["show-all"]} onClick={open}>
                Show All
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
