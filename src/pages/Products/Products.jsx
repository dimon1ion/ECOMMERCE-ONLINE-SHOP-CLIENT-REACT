import { useContext, useEffect, useMemo, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
import Slider from "@mui/material/Slider";
import Select from "react-select";
// import { CategoriesLoad, CitiesLoad } from "../../Store/dataFunctions";
import { initCategories } from "../../redux/storages/categoriesStore";
// import {
//   GenerateArrayForSelect,
//   GenerateCategoriesView,
// } from "../../Store/functions";
// import { initCities } from "../../Store/citiesStore";
// import CategoriesMenu from "./CategoriesMenu";
// import ServerPath from "../../enums/ServerPath";
import getRequest from "../../requests/getRequest";
import CategoriesContext from "../../contexts/Categories.context";
import backImage from "../../assets/styles/backImage.module.scss";
import s from "./Products.module.scss";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import Search from "../../components/Search/Search";
import ViewProduct from "../../components/ViewProduct/ViewProduct";
import CategoriesMenu from "../../components/CategoriesMenu";
import { Dropdown, Pagination } from "@nextui-org/react";
import ServerPath from "../../enums/ServerPath";

function valuetext(value) {
  return `${value}$`;
}

export default function Products(prop) {
  const [selectedCategory, setSelectedCategory] = useState("Products");
  const [selectedKey, setSelectedKey] = useState(new Set([]));
  const [sortingValues, setSortingValues] = useState([]);

  const [searchTitle, setSearchTitle] = useState("");
  const [queryCategoryId, setQueryCategoryId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const maxProducts = 10;

  const [sendRequestByUseEffect, setSendRequestByUseEffect] = useState(false);

  const params = useParams();
  const [query, setQuery] = useSearchParams();

  // console.log(params, query);
  // console.log(selectedCategoryId);

  const selectedValue = useMemo(
    () => Array.from(selectedKey).join(", ").replaceAll("_", " "),
    [selectedKey]
  );

  


  useEffect(() => {
    getSortingValues();
  }, []);

  useEffect(() => {
    const qCategory = query.get("category");
    setQueryCategoryId(qCategory);
    if (qCategory) {
      sendRquest();
    }
  }, [query]);

  // console.log(sendRequestByUseEffect, page);
  
  useEffect(() => {
    // console.log("request")
    sendRequestToServer();
  }, [sendRequestByUseEffect, page]);

  const sendRquest = () => {
    // console.log("send")
    setSendRequestByUseEffect(state => !state);
  }

  const sendRequestToServer = async () => {
    const categorieId = selectedCategoryId
      ? selectedCategoryId
      : queryCategoryId;
      // console.log(categorieId);
    if (categorieId === null) {
      const url = new URL(
        ServerPath.SERVERPATH +
          ServerPath.GETPRODUCTSBYTITLE +
          `/${searchTitle}`
      );
      const { searchParams } = url;
      searchParams.append("page", page);
      searchParams.append("onPage", maxProducts);

      let sorted = false;
      selectedKey.forEach((value) => {
        const result = sortingValues.find(item => item.value === value);
        if (result !== undefined) {
          searchParams.append("sorting", result.key);
          sorted = true;
          return;
        }
      });
      if(sorted === false){
        return;
          // searchParams.append("sorting", 1);
      }
      // const response = await getRequest(url);
      // if (response === null) {
      //   return;
      // }
      // const data = await response.json();
      // console.log(data);
    } else {
      setQuery(new URLSearchParams());
    }
  };

  const getSortingValues = async () => {
    const response = await getRequest(
      ServerPath.SERVERPATH + ServerPath.GETSORTING
    );
    if (response === null) {
      return;
    }
    const { $values: values } = await response.json();
    setSortingValues(values);
    setSelectedKey(new Set([values[0].value]));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    setSendRequestByUseEffect(state => !state);
  };

  // const handleCategories = async () => {
  //   if (allCategories !== undefined) {
  //     return;
  //   }

  //   // let result = await CategoriesLoad(serverPath + getAllCategoriesPath);
  //   const response = await getRequest(ServerPath.SERVERPATH + ServerPath.GETALLCATEGORIES);
  //   if (response === null || !response.ok) {
  //     console.log("error");
  //     return;
  //   }
  //   const data = await response.json();
  //   console.log(data);
  //   dispatch(initCategories(data));
  //   // setCategoriesView(GenerateCategoriesView(result));
  // }
  // async function handleCities() {
  //   let result = await CitiesLoad(serverPath + getAllCitiesPath);
  //   if (result != null) {
  //     dispatch(initCities(result));
  //   }
  // }

  // useEffect(() => {
  //   handleCategories();
  // if (canChangeCategories === true) {
  //     handleCategories();
  // } else {
  //     setCategoriesView(GenerateCategoriesView(allCategories));
  // }
  // if (canChangeCities === true) {
  //     handleCities();
  // }

  // if (categories === undefined && allCategories !== undefined) {
  //   setCategories(GenerateArrayForSelect(allCategories));
  // }
  // }, []);

  //#region Store states

  // const getAllCategoriesPath = useSelector(
  //   (state) => state.categoriesStore.getAllPath
  // );
  // const getAllCitiesPath = useSelector((state) => state.citiesStore.getAllPath);

  // const categoriesSelect = useSelector(
  //   (state) => state.categoriesStore.allCategoriesSelectType
  // );
  // const { allCategories, allCategoriesSelectType:categoriesSelect } = useSelector(
  //   (state) => state.categoriesStore
  // );
  // const cities = useSelector((state) => state.citiesStore.allCitiesSelectType);

  // const canChangeCities = useSelector(
  //   (state) => state.citiesStore.canChangeCities
  // );

  //#endregion

  const [sliderValue, setSliderValue] = useState([0, 10000]);
  const [categoriesView, setCategoriesView] = useState(undefined);

  //Dispatch
  // const dispatch = useDispatch();

  //Local states
  //   const [categories, setCategories] = useState(undefined);

  //#region Functions

  const handleChangeSliderValue = (event, newValue) => {
    if (+newValue[0] < 0) {
      newValue[0] = 0;
    } else if (+newValue[1] > maxPrice) {
      newValue[1] = maxPrice;
    }
    setSliderValue(newValue);
  };

  const blurSliderValues = () => {
    if (+sliderValue[0] > +sliderValue[1]) {
      let value1 = sliderValue[0];
      let value2 = sliderValue[1];
      setSliderValue([value2, value1]);
    }
  };

  //#endregion

  return (
    <div>
      <section className={`${backImage["back-image"]} ${s["categories"]}`}>
        <div className="container">
          <nav className={s["navigation"]}>
            <ul>
              <li>
                <NavLink to={"/home"}>Home</NavLink>
              </li>
              <li>{selectedCategory}</li>
            </ul>
            <h2 className={`${s["name-categorie"]} headerCategory`}>
              Category{" "}
            </h2>
          </nav>
          <div className="row">
            <div className="d-flex justify-content-center">
              <div className={`${s["banner"]} w-100 mb-3`}>
                {/* <form className={`input-group ${s["search"]}`}>
                  <Select
                    className={
                      "col-12 col-md-6 col-lg-3 input-react-select" +
                      (false ? "" : " exception")
                    }
                    isMulti={false}
                    // options={categoriesSelect}
                    // onChange={(newValue) =>
                    //   OnChangeSelect(
                    //     newValue,
                    //     setCityValue,
                    //     setValidateCity,
                    //     cityErrText
                    //   )
                    // }
                    placeholder="Select Category"
                    // isLoading={categoriesSelect === undefined ? true : false}
                    isLoading={ true }
                    isClearable={true}
                    isSearchable={true}
                  />
                  <input
                    id="searchText"
                    type="text"
                    className="form-control col-12 col-md"
                    aria-label="Text input with dropdown button"
                    placeholder="Type Your key word"
                  />
                  <button
                    className="btn btn-green col-12 col-md-2"
                    type="submit"
                  >
                    SEARCH
                  </button>
                </form> */}
                <Search
                  searchValue={searchTitle}
                  setSearchValue={setSearchTitle}
                  setSelectedCategoryId={setSelectedCategoryId}
                  onSubmit={onSubmit}
                />
              </div>
            </div>
          </div>

          <div className={s["categories-info"]} id="CollapseParent">
            <div className={`row ${s["row"]}`}>
              <div className={`filter ${s["filter"]} col-lg-3 col-md-4`}>
                <div
                  className={`filter-item ${s["filter-item"]} position-relative`}
                >
                  <p>
                    <button
                      className={`${s["my-btn-filter"]} d-flex justify-content-between`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#allCategories"
                      aria-expanded="false"
                      aria-controls="allCategories"
                      // onClick="closePrevFilter(event)"
                    >
                      <span>All Categories</span>
                      <div className={s["liquid"]}></div>
                    </button>
                  </p>
                  <div
                    className={`collapse ${s["collapse"]} show`}
                    id="allCategories"
                    data-bs-parent="#CollapseParent"
                  >
                    <div
                      className={`card ${s["card"]} card-body ${s["card-body"]}`}
                    >
                      <CategoriesMenu />
                    </div>
                  </div>
                </div>
                <div className={s["filter-item"]}>
                  <p>
                    <button
                      className={`${s["my-btn-filter"]} d-flex justify-content-between collapsed ${s["collapsed"]}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseCondition"
                      aria-expanded="false"
                      aria-controls="collapseCondition"
                      // onClick="closePrevFilter(event)"
                    >
                      <span>Price</span>
                      <div className={s["liquid"]}></div>
                    </button>
                  </p>
                  <div
                    className="collapse"
                    id="collapseCondition"
                    data-bs-parent="#CollapseParent"
                  >
                    <div
                      className={`card ${s["card"]} card-body ${s["card-body"]} ${s["scroll-hidden"]}`}
                    >
                      {/* <li><input id="filterNew" type="checkbox" className="filter-input"
                                                onclick="clickfilterInputNewUsed(event)"/>New</li>
                                        <li><input id="filterUsed" type="checkbox" className="filter-input"
                                                onclick="clickfilterInputNewUsed(event)"/>Used</li> */}
                      <div className="d-flex">
                        <input
                          type="number"
                          className="border border-dark w-100 text-center rounded"
                          value={sliderValue[0]}
                          onChange={(event) => {
                            handleChangeSliderValue(null, [
                              event.target.value,
                              sliderValue[1],
                            ]);
                          }}
                          onBlur={() => {
                            blurSliderValues();
                          }}
                        />
                        <span className="w-25 d-flex justify-content-center">
                          -
                        </span>
                        <input
                          type="number"
                          className="border border-dark w-100 text-center rounded"
                          value={sliderValue[1]}
                          onChange={(event) => {
                            handleChangeSliderValue(null, [
                              sliderValue[0],
                              event.target.value,
                            ]);
                          }}
                          onBlur={() => {
                            blurSliderValues();
                          }}
                        />
                        {/* <button className="w-50 ms-2 border border-light rounded">
                          Ok
                        </button> */}
                      </div>
                      <Slider
                        getAriaLabel={() => "Minimum distance"}
                        value={sliderValue}
                        onChange={handleChangeSliderValue}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        min={minPrice}
                        max={maxPrice}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-8 col-lg-9">
                <div className={`${s["white-block"]} ${s["info"]}`}>
                  <div
                    className={`${s["feature"]} d-flex justify-content-between align-items-center`}
                  >
                    <h4>Publications</h4>
                    <div className={`${["sort"]} d-flex align-items-center`}>
                      <span className="mx-2">Sort by:</span>
                      <div className="dropdown">
                        {/* <Dropdown.Button color={"success"} shadow>
                            {selectedValue}
                          </Dropdown.Button> */}
                        <Dropdown>
                          <Dropdown.Button
                            shadow
                            color="success"
                            css={{ tt: "capitalize" }}
                          >
                            {selectedValue}
                          </Dropdown.Button>
                          <Dropdown.Menu
                            aria-label="Single selection actions"
                            color="success"
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={selectedKey}
                            onSelectionChange={setSelectedKey}
                          >
                            {sortingValues.map(({ key, value }) => (
                              <Dropdown.Item key={value}>{value}</Dropdown.Item>
                            ))}
                            {/* <Dropdown.Item key="text">Text</Dropdown.Item>
                            <Dropdown.Item key="number">Number</Dropdown.Item>
                            <Dropdown.Item key="date">Date</Dropdown.Item>
                            <Dropdown.Item key="single_date">
                              Single Date
                            </Dropdown.Item>
                            <Dropdown.Item key="iteration">
                              Iteration
                            </Dropdown.Item> */}
                          </Dropdown.Menu>
                        </Dropdown>
                        {/* <button
                          id="sortForChange"
                          className={`btn ${s["btn"]}`}
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          All
                        </button> */}
                        {/* <ul className={s["dropdown-menu"]}>
                          <li>
                            <a
                              className={s["my-dropdown-item"]}
                              // onclick="changeSort(event)"
                            >
                              Newest(low)
                            </a>
                          </li>
                          <li>
                            <a
                              className="my-dropdown-item"
                              onclick="changeSort(event)"
                            >
                              Newest(hight)
                            </a>
                          </li>
                          <li>
                            <a
                              className="my-dropdown-item"
                              onclick="changeSort(event)"
                            >
                              Price(low)
                            </a>
                          </li>
                          <li>
                            <a
                              className="my-dropdown-item"
                              onclick="changeSort(event)"
                            >
                              Price(hight)
                            </a>
                          </li>
                          <li>
                            <a
                              className="my-dropdown-item"
                              onclick="changeSort(event)"
                            >
                              All
                            </a>
                          </li>
                        </ul> */}
                      </div>
                    </div>
                  </div>
                  <div className={s["ad"]}>
                    <div className="d-flex flex-column">
                      <ViewProduct />
                      <ViewProduct />
                    </div>
                  </div>
                  <div className="text-center">
                    <Pagination
                      color={"success"}
                      initialPage={1}
                      total={totalPage}
                      onChange={(number) => setPage(number)}
                    />
                  </div>
                  {/* <div className="pagenation text-center">
                    <ul className="pages">
                      <li>
                        <a href="#">‹</a>
                      </li>
                      <li>
                        <a href="#">1</a>
                      </li>
                      <li className="active">
                        <a href="#">2</a>
                      </li>
                      <li>
                        <a href="#">3</a>
                      </li>
                      <li>
                        <a href="#">4</a>
                      </li>
                      <li>
                        <a href="#">5</a>
                      </li>
                      <li className="disable">
                        <a>...</a>
                      </li>
                      <li>
                        <a href="#">10</a>
                      </li>
                      <li>
                        <a href="#">20</a>
                      </li>
                      <li>
                        <a href="#">30</a>
                      </li>
                      <li>
                        <a href="#">›</a>
                      </li>
                    </ul>
                  </div> */}
                </div>
              </div>
              {/* <div className="col-md-2 d-none d-lg-block">
                <a href="#">
                   <img src="../data/images/advertising.jpg" alt="image"/>
                </a>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      <nav className={s["post-rek"]}>
        <div className={`d-flex ${s["background"]}`}>
          <div className="container text-center">
            <h2 className="">
              Our sales platform is one of the best platforms!
            </h2>
            <h4 className="">Developers' words</h4>
            {/* <a className={`btn ${s["btn"]} ${s["btn-green"]}`}>Post Your Ad</a> */}
          </div>
        </div>
      </nav>
    </div>
  );
}
