

export default function ErrorMessage({show, errorText}) {
    return (
        <>
            {show && <div className={s["errorMessage"]}>{errorText}</div>}
        </>
    )
}