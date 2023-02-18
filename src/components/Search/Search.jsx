import Select from "react-select";
import s from "./Search.module.scss";
import validate from "../../assets/styles/inputValid.module.scss";
import { useContext, useState } from "react";
import CategoriesContext from "../../contexts/Categories.context";
import { useNavigate } from "react-router-dom";


export default function Search(props) {
    
  // {searchValue, setSearchValue, setSelectedCategoryId, onSubmit}

  const { allCategoriesSelectType:categoriesSelect } = useContext(CategoriesContext);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const navigate = useNavigate();


    const onChangeSelected = (newValue) => {
      setSelectedCategoryId(newValue?.value ?? null);
    }

    const onSubmit = (event) => {
      event.preventDefault();
      const searchParams = new URLSearchParams();
      searchParams.append("title", searchValue);
      if (selectedCategoryId !== null) {
        searchParams.append("categoryId", selectedCategoryId);
      }
      navigate("/products?" + searchParams.toString());
    }

    return (
        <>
            <form onSubmit={onSubmit} className={`input-group ${s["search"]} w-100 mb-3`}>
                  <Select
                    className={
                      `col-12 col-md-5 col-lg-3 ${s["input-react-select"]}
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