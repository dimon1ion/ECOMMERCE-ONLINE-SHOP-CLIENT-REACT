import s from "./ErrorMessage.module.scss";

export default function ErrorMessage({show, children}) {
    return (
        <>
            {show || <div className={s["errorMessage"]}>{children}</div>}
        </>
    )
}