import Select from "react-select";
import s from "./Search.module.scss";
import validate from "../../assets/styles/inputValid.module.scss";
import { useContext } from "react";
import CategoriesContext from "../../contexts/Categories.context";


export default function Search({searchValue, setSearchValue, setSelectedCategoryId, onSubmit}) {
    
  const { allCategoriesSelectType:categoriesSelect } = useContext(CategoriesContext);


    const onChangeSelected = (newValue) => {
      setSelectedCategoryId(newValue?.value ?? null);
    }

    return (
        <>
            <form onSubmit={onSubmit} className={`input-group ${s["search"]}`}>
                  <Select
                    className={
                      `col-12 col-md-6 col-lg-3 ${s["input-react-select"]}
                      ${(false ? "" : validate["exception"])}`
                    }
                    isMulti={false}
                    options={categoriesSelect}
                    onChange={onChangeSelected}
                    // pageSize={2}
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
                  <input
                    id="searchText"
                    type="text"
                    value={searchValue}
                    onChange={({target: {value}}) => setSearchValue(value)}
                    className={`${s["form-control"]} form-control col-12 col-md`}
                    aria-label="Text input with dropdown button"
                    placeholder="Type Your key word"
                  />
                  <button
                    className={`btn ${s["btn"]} ${s["btn-green"]} col-12 col-md-2`}
                    type="submit"
                  >
                    SEARCH
                  </button>
                </form>
        </>
    );
}