import s from "./ButtonLoad.module.scss";

export default function ButtonLoad({ children, submitted, disabled = false }) {
  return (
    <>
      <button
        type="submit"
        className={`btn ${
          submitted ? s["btn-loading-blue"] : s["btn-green"]
        } text-center`}
        disabled={ submitted || disabled }
      >
        {submitted ? (
          <>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    </>
  );
}
