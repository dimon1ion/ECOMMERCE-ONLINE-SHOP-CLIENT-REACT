

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Select from "react-select";
import { CategoriesLoad, CitiesLoad } from "../../Store/dataFunctions";
import { initCategories } from "../../Store/categoriesStore";
import {
  GenerateArrayForSelect,
  GenerateCategoriesView,
} from "../../Store/functions";
import { initCities } from "../../Store/citiesStore";
import CategoriesMenu from "./CategoriesMenu/categoriesMenu";

function valuetext(value) {
  return `${value}$`;
}

export default function Products(prop) {
  async function handleCategories() {
    let result = await CategoriesLoad(serverPath + getAllCategoriesPath);
    if (result != null) {
      dispatch(initCategories(result));
      setCategoriesView(GenerateCategoriesView(result));
    }
  }
  async function handleCities() {
    let result = await CitiesLoad(serverPath + getAllCitiesPath);
    if (result != null) {
      dispatch(initCities(result));
    }
  }

  useEffect(() => {
    console.log(canChangeCategories);
    console.log(canChangeCities);
    if (canChangeCategories === true) {
        handleCategories();
    } else {
        setCategoriesView(GenerateCategoriesView(allCategories));
    }
    if (canChangeCities === true) {
        handleCities();
    }

    // if (categories === undefined && allCategories !== undefined) {
    //   setCategories(GenerateArrayForSelect(allCategories));
    // }
  }, []);

  //#region Store states

  const serverPath = useSelector((state) => state.server.path);
  const getAllCategoriesPath = useSelector(
    (state) => state.categoriesStore.getAllPath
  );
  const getAllCitiesPath = useSelector((state) => state.citiesStore.getAllPath);

  const categoriesSelect = useSelector(
    (state) => state.categoriesStore.allCategoriesSelectType
  );
  const allCategories = useSelector(
    (state) => state.categoriesStore.allCategories
  );
  const cities = useSelector((state) => state.citiesStore.allCitiesSelectType);

  const canChangeCategories = useSelector(
    (state) => state.categoriesStore.canChangeCategories
  );
  const canChangeCities = useSelector(
    (state) => state.citiesStore.canChangeCities
  );

  //#endregion

  const [sliderValue, setSliderValue] = React.useState([0, 20]);
  const [maximumPrice, setЬaximumPrice] = React.useState(200);
  const [categoriesView, setCategoriesView] = React.useState(undefined);

  //Dispatch
  const dispatch = useDispatch();

  //Local states
  //   const [categories, setCategories] = React.useState(undefined);

  //#region Functions

  const handleChangeSliderValue = (event, newValue) => {
    if (+newValue[0] < 0) {
      newValue[0] = 0;
    } else if (+newValue[1] > maximumPrice) {
      newValue[1] = maximumPrice;
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
      <section id="Categories" className="back-image">
        <div className="container">
          <nav className="navigation">
            <ul>
              <li>
                <a href="../index.html">Home</a>
              </li>
              <li>
                <a href="#" className="headerCategory">
                  Category
                </a>
              </li>
            </ul>
            <h2 className="name-categorie headerCategory">Category </h2>
          </nav>
          <div className="row">
            <div className="d-flex justify-content-center">
              <div className="banner w-100 mb-3">
                <form className="input-group search">
                  {/* <div className="dropdown col-12 col-md-6 col-lg-2">
                    <button
                      id="categoryForChange"
                      className="btn btn-white dropdown-toggle w-100"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Select Category
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className="my-dropdown-item"
                          onclick="changeCategory(event)"
                        >
                          Cars & Vehicles
                        </a>
                      </li>
                      <li>
                        <a
                          className="my-dropdown-item"
                          onclick="changeCategory(event)"
                        >
                          Electrics & Gedgets
                        </a>
                      </li>
                      <li>
                        <a
                          className="my-dropdown-item"
                          onclick="changeCategory(event)"
                        >
                          Real Estate
                        </a>
                      </li>
                      <li>
                        <a
                          className="my-dropdown-item"
                          onclick="changeCategory(event)"
                        >
                          Sports & Games
                        </a>
                      </li>
                      <li>
                        <a
                          className="my-dropdown-item"
                          onclick="changeCategory(event)"
                        >
                          Fshion & Beauty
                        </a>
                      </li>
                      <li>
                        <a
                          className="my-dropdown-item"
                          onclick="changeCategory(event)"
                        >
                          Pets & Animals
                        </a>
                      </li>
                      <li>
                        <a
                          className="my-dropdown-item"
                          onclick="changeCategory(event)"
                        >
                          Home Appliances
                        </a>
                      </li>
                      <li>
                        <a
                          className="my-dropdown-item"
                          onclick="changeCategory(event)"
                        >
                          Matrimony Services
                        </a>
                      </li>
                      <li>
                        <a
                          className="my-dropdown-item"
                          onclick="changeCategory(event)"
                        >
                          Miscellaneous{" "}
                        </a>
                      </li>
                      <li>
                        <a
                          className="my-dropdown-item"
                          onclick="changeCategory(event)"
                        >
                          Job Openings{" "}
                        </a>
                      </li>
                      <li>
                        <a
                          className="my-dropdown-item"
                          onclick="changeCategory(event)"
                        >
                          Books & Magazines
                        </a>
                      </li>
                    </ul>
                  </div> */}
                  <Select
                    className={
                      "col-12 col-md-6 col-lg-3 input-react-select" +
                      (false ? "" : " exception")
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
                  {/* <div className="dropdown col-12 col-md-6 col-lg-3">
                    <button
                      id="locationForChange"
                      className="btn btn-white dropdown-toggle w-100"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Select Location
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className="my-dropdown-item"
                          onclick="changeLocation(event)"
                        >
                          United Kingdom
                        </a>
                      </li>
                      <li>
                        <a
                          className="my-dropdown-item"
                          onclick="changeLocation(event)"
                        >
                          United States
                        </a>
                      </li>
                      <li>
                        <a
                          className="my-dropdown-item"
                          onclick="changeLocation(event)"
                        >
                          China
                        </a>
                      </li>
                      <li>
                        <a
                          className="my-dropdown-item"
                          onclick="changeLocation(event)"
                        >
                          Russia
                        </a>
                      </li>
                    </ul>
                  </div> */}
                  <Select
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
                </form>
              </div>
            </div>
          </div>

          <div className="categories-info" id="CollapseParent">
            <div className="row">
              <div className="filter col-lg-3 col-md-4">
                <div className="filter-item position-relative">
                  <p>
                    <button
                      className="my-btn-filter d-flex justify-content-between"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#allCategories"
                      aria-expanded="false"
                      aria-controls="allCategories"
                      onclick="closePrevFilter(event)"
                    >
                      <span>All Categories</span>
                      <div className="liquid"></div>
                    </button>
                  </p>
                  <div
                    className="collapse show"
                    id="allCategories"
                    data-bs-parent="#CollapseParent"
                  >
                    <div className="card card-body">
                      <CategoriesMenu categories={categoriesView}/>
                    </div>
                  </div>
                </div>
                <div className="filter-item">
                  <p>
                    <button
                      className="my-btn-filter d-flex justify-content-between collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseCondition"
                      aria-expanded="false"
                      aria-controls="collapseCondition"
                      onclick="closePrevFilter(event)"
                    >
                      <span>Price</span>
                      <div className="liquid"></div>
                    </button>
                  </p>
                  <div
                    className="collapse"
                    id="collapseCondition"
                    data-bs-parent="#CollapseParent"
                  >
                    <div className="card card-body">
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
                            <button className="w-50 ms-2 border border-light rounded">Ok</button>
                          </div>
                          <Slider
                            getAriaLabel={() => "Minimum distance"}
                            value={sliderValue}
                            onChange={handleChangeSliderValue}
                            valueLabelDisplay="auto"
                            getAriaValueText={valuetext}
                            max={200}
                          />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-8 col-lg-9">
                <div className="white-block info">
                  <div className="feature d-flex justify-content-between align-items-center">
                    <h4>Publications</h4>
                    <div className="sort d-flex align-items-center">
                      <span>Sort by:</span>
                      <div className="dropdown">
                        <button
                          id="sortForChange"
                          className="btn"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          All
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <a
                              className="my-dropdown-item"
                              onclick="changeSort(event)"
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
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div id="product-items">
                    <div className="loaing d-flex justify-content-center mt-5">
                      {/* <img src="../gif/Gray_circles_rotate.gif" alt="loading.." className="w-25"/> */}
                    </div>
                    <div className="row">
                      {/* <div className="ad-image item-image col-12 col-md-5 col-lg-4">
                                      <img src="../data/phone.jpg" alt="Samsung Galaxy S6 Edge" />
                                    </div>
                                    <div className="col">
                                      <div className="info">
                                        <h5>$380.00</h5>
                                        <a href="#" className="product-name">Samsung Galaxy S6 Edge</a>
                                        <div className="product-categorie">
                                          <a href="#">Electronics & Gedgets</a>
                                        </div>
                                      </div>
                                      <div className="additionally d-none w-larger">
                                        <div className="left-icons d-flex">
                                          <a href="#">7 Jan 10:10 pm</a>
                                          <a href="#" className="tags">Used</a>
                                        </div>
                                        <div className="icons">
                                          <a href="#" className="nav-icon" title="Los Angeles"></a>
                                          <a href="#" className="individual" title="Individual"></a>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="additionally col-12 w-smaller">
                                      <div className="left-icons d-flex">
                                        <a href="#">7 Jan 10:10 pm</a>
                                        <a href="#" className="tags">Used</a>
                                      </div>
                                      <div className="icons">
                                        <a href="#" className="nav-icon" title="Los Angeles"></a>
                                        <a href="#" className="individual" title="Individual"></a>
                                      </div>
                                    </div> */}
                    </div>
                  </div>
                  <div className="pagenation text-center">
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
                  </div>
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

      <nav id="postRek">
        <div className="d-flex background">
          <div className="container text-center">
            <h2 className="">Do you have something-sell?</h2>
            <h4 className="">Post your ad for free!</h4>
            <a className="btn btn-green">Post Your Ad</a>
          </div>
        </div>
      </nav>
    </div>
  );
}
