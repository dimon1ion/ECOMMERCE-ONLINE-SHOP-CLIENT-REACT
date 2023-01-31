import Select from "react-select";
import s from "./Search.module.scss";
import validate from "../../assets/styles/inputValid.scss";


export default function Search(props) {
    

    return (
        <>
            <form className={`input-group ${s["search"]}`}>
                  <Select
                    className={
                      `col-12 col-md-6 col-lg-3 ${s["input-react-select"]}
                      ${(false ? "" : validate["exception"])}`
                    }
                    isMulti={false}
                    options={categoriesSelect}
                    // onChange={(newValue) =>
                    //   OnChangeSelect(
                    //     newValue,
                    //     setCityValue,
                    //     setValidateCity,
                    //     cityErrText
                    //   )
                    // }
                    placeholder="Select Category"
                    isLoading={categoriesSelect === undefined ? true : false}
                    isClearable={true}
                    isSearchable={true}
                  />
                  {/* <Select
                    className={
                      "col-12 col-md-6 col-lg-3 input-react-select" +
                      (false ? "" : " exception")
                    }
                    isMulti={false}
                    options={cities}
                    // onChange={(newValue) =>
                    //   OnChangeSelect(
                    //     newValue,
                    //     setCityValue,
                    //     setValidateCity,
                    //     cityErrText
                    //   )
                    // }
                    placeholder="Select City"
                    isLoading={cities === undefined ? true : false}
                    isClearable={true}
                    isSearchable={true}
                  /> */}
                  <input
                    id="searchText"
                    type="text"
                    className={`${s["form-control"]} col-12 col-md`}
                    aria-label="Text input with dropdown button"
                    placeholder="Type Your key word"
                  />
                  <button
                    className={`${s["btn"]} ${s["btn-green"]} col-12 col-md-2`}
                    type="submit"
                  >
                    SEARCH
                  </button>
                </form>
        </>
    );
}