import { useContext, useEffect, useMemo, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
import Slider from "@mui/material/Slider";
import Select from "react-select";
// import { CategoriesLoad, CitiesLoad } from "../../Store/dataFunctions";
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
import {
  NavLink,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Search from "../../components/Search/Search";
import ViewProduct from "../../components/ViewProduct/ViewProduct";
import CategoriesMenu from "../../components/CategoriesMenu";
import { Dropdown, Loading, Pagination } from "@nextui-org/react";
import ServerPath from "../../enums/ServerPath";
import Navigation from "../../components/Navigation";
import usePagination from "../../hooks/usePagination";

function valuetext(value) {
  return `${value}$`;
}

export default function Products(prop) {
  const [isSortingReady, setIsSortingReady] = useState(false);
  const [isQueryReady, setIsQueryReady] = useState(false);
  const [products, setProducts] = useState(undefined);

  // Переделан Search компонент
  const [selectedCategory, setSelectedCategory] = useState("Products");

  const [selectedKey, setSelectedKey] = useState(new Set([]));
  const [sortingValues, setSortingValues] = useState([]);
  const [navigationArr, setNavigationArr] = useState([]);
  const [navigationName, setNavigationName] = useState("");

  const [queryCategoryId, setQueryCategoryId] = useState(null);
  const [queryCategoryName, setQueryCategoryName] = useState(null);
  const [querySellerId, setQuerySellerId] = useState(null);
  const [querySellerName, setQuerySellerName] = useState(null);
  const [queryTitle, setQueryTitle] = useState(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const [sendRequestByUseEffect, setSendRequestByUseEffect] = useState(false);

  const params = useParams();
  const [query, setQuery] = useSearchParams();
  const navigate = useNavigate();

  // console.log(params, query);
  // console.log(selectedCategoryId);

  const selectedValue = useMemo(
    () => Array.from(selectedKey).join(", ").replaceAll("_", " "),
    [selectedKey]
  );

  const {
    currentPage,
    offset,
    totalPages,
    setTotalPages,
    decrement,
    increment,
    setCurrentPage,
  } = usePagination(1, 5);

  const { getCategoryById } = useContext(CategoriesContext);

  useEffect(() => {
    getSortingValues();
  }, []);

  useEffect(() => {
    console.log("changed");
    const qCategoryId = query.get("categoryId");
    const qTitle = query.get("title");
    const qSellerId = query.get("sellerId");
    console.log(qCategoryId, qTitle, qSellerId)
    setQueryTitle(qTitle);
    setQueryCategoryId(qCategoryId);
    setQuerySellerId(qSellerId);
    setIsQueryReady(true);
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    changeNavigation();
  }, [queryTitle, queryCategoryName, querySellerName]);

  // console.log(sendRequestByUseEffect, page);

  useEffect(() => {
    // console.log("request")
    sendRequestToServer();
  }, [
    sendRequestByUseEffect,
    currentPage,
    queryTitle,
    queryCategoryId,
    querySellerId,
    selectedKey,
  ]);

  useEffect(() => {
    setSliderValue([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const changeNavigation = () => {
    const navArr = [{ name: "Home", ref: "/home" }];

    if (queryTitle) {
      navArr.push({ name: queryTitle });
      setNavigationName(queryTitle.trim() !== "" ? queryTitle : "Products");
    } else if (queryCategoryName) {
      navArr.push({ name: queryCategoryName });
      setNavigationName(queryCategoryName);
    } else if (querySellerName) {
      navArr.push({ name: querySellerName });
      setNavigationName(querySellerName);
    }
    setNavigationArr(navArr);
  };

  const callRequest = () => {
    // console.log("send")
    setSendRequestByUseEffect((state) => !state);
  };

  const getSortingKey = () => {
    for (const value of selectedKey) {
      const result = sortingValues.find((item) => item.value === value);
      if (result !== undefined) {
        return result.key;
      }
    }
  };

  const sendRequestToServer = async (sortByPrice = false) => {
    if (!isQueryReady || !isSortingReady) {
      return;
    }
    let response, data;
    const searchParams = new URLSearchParams();
    searchParams.append("page", currentPage);
    searchParams.append("onPage", offset);
    const sortingKey = getSortingKey();
    if (sortingKey !== undefined) {
      searchParams.append("sorting", sortingKey);
    }
    console.log("SORT -->", getSortingKey());
    if (sortByPrice) {
      const [fromPrice, toPrice] = sliderValue;
      searchParams.append("fromPrice", fromPrice);
      if (toPrice !== 0) {
        searchParams.append("toPrice", toPrice);
      }
    }

    if (queryCategoryId !== null) {
      const url = new URL(
        ServerPath.SERVERPATH +
          ServerPath.GETPRODUCTSBYCATEGORIEID +
          `/${queryCategoryId}`
      );
      searchParams.append("title", queryTitle ?? "");
      response = await getRequest(
        url.toString() + "?" + searchParams.toString()
      );
      if (response === null || !response.ok) {
        navigate("/servererror");
        return;
      }
      data = await response.json();
      setQueryCategoryName(data.category?.name);
    } else if (querySellerId !== null) {
      const url = new URL(
        ServerPath.SERVERPATH +
          ServerPath.GETPRODUCTSBYSELLERID +
          `/${querySellerId}`
      );
      searchParams.append("title", queryTitle ?? "");
      response = await getRequest(
        url.toString() + "?" + searchParams.toString()
      );
      if (response === null || !response.ok) {
        navigate("/servererror");
        return;
      }
      data = await response.json();
      setQuerySellerName(data.seller?.companyName);
    } else {
      const url = new URL(
        ServerPath.SERVERPATH + ServerPath.GETPRODUCTSBYTITLE
      );
      console.log(url.toString(), searchParams.toString());
      searchParams.append("title", "");
      response = await getRequest(
        url.toString() + "?" + searchParams.toString()
      );
      if (response === null || !response.ok) {
        navigate("/servererror");
        return;
      }
      data = await response.json();
    }
    if (!sortByPrice) {
      if (data.minPrice && data.maxPrice) {
        setMinPrice(Math.floor(data.minPrice));
        setMaxPrice(Math.ceil(data.maxPrice));
      } else {
        setMinPrice(0);
        setMaxPrice(0);
      }
    }
    setTotalPages(data.totalPageCount);
    setProducts(data.products?.$values);
    console.log(data);
    // const response = await getRequest(url);
    // if (response === null) {
    //   return;
    // }
    // const data = await response.json();
    // console.log(data);
  };

  const getSortingValues = async () => {
    const response = await getRequest(
      ServerPath.SERVERPATH + ServerPath.GETSORTING
    );
    if (response === null || !response.ok) {
      navigate("/servererror");
      return;
    }
    const { $values: values } = await response.json();
    setSortingValues(values);
    setSelectedKey(new Set([values[0].value]));
    setIsSortingReady(true);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setCurrentPage(1);
    setSendRequestByUseEffect((state) => !state);
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
  const [sliderIsLoading, setSliderIsLoading] = useState(false);

  //Dispatch
  // const dispatch = useDispatch();

  //Local states
  //   const [categories, setCategories] = useState(undefined);

  //#region Functions

  const handleChangeSliderValue = (event, newValue) => {
    const result = newValue.map((value) => {
      if (+value < +minPrice) {
        return +minPrice;
      } else if (+value > +maxPrice) {
        return +maxPrice;
      }
      return value;
    });
    // if (+newValue[0] < +minPrice) {
    //   newValue[0] = +minPrice;
    // } else if (+newValue[1] > +maxPrice) {
    //   newValue[1] = +maxPrice;
    // }
    setSliderValue(result);
  };

  const blurSliderInputs = () => {
    if (+sliderValue[0] > +sliderValue[1]) {
      let value1 = sliderValue[0];
      let value2 = sliderValue[1];
      setSliderValue([value2, value1]);
    }
  };

  const blurSlider = async () => {
    console.log("bluuuuur");
    setSliderIsLoading(true);
    await sendRequestToServer(true);
    setSliderIsLoading(false);
  };

  //#endregion

  return (
    <>
      {products && (
        <>
          <section className={`${backImage["back-image"]} ${s["categories"]}`}>
            <div className="container">
              <Navigation
                navigationArr={navigationArr}
                preText={navigationName === "" ? "" : "Searching results:"}
                title={navigationName === "" ? "All products" : navigationName}
              />
              {/* <nav className={s["navigation"]}>
            <ul>
              <li>
                <NavLink to={"/home"}>Home</NavLink>
              </li>
              <li>{selectedCategory}</li>
            </ul>
            <h2 className={`${s["name-categorie"]} headerCategory`}>
              Category{" "}
            </h2>
          </nav> */}
              <div className="row">
                <div className="d-flex justify-content-center">
                  {/* <div className={`${s["banner"]} w-100 mb-3`}> */}
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
                  <Search />
                  {/* </div> */}
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
                                  +event.target.value,
                                  sliderValue[1],
                                ]);
                              }}
                              onBlur={() => {
                                blurSliderInputs();
                                blurSlider();
                              }}
                              disabled={sliderIsLoading}
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
                                  +event.target.value,
                                ]);
                              }}
                              onBlur={() => {
                                blurSliderInputs();
                                blurSlider();
                              }}
                              disabled={sliderIsLoading}
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
                            disabled={sliderIsLoading}
                            onBlur={() => {blurSlider()}}
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
                        <div
                          className={`${s["sort"]} d-flex flex-column flex-sm-row align-items-sm-center`}
                        >
                          <span className={`${s["sort-by"]} mx-2`}>
                            Sort by:
                          </span>
                          <div className={s["dropdown"]}>
                            {/* <Dropdown.Button color={"success"} shadow>
                            {selectedValue}
                          </Dropdown.Button> */}
                            <Dropdown>
                              <Dropdown.Button
                                shadow
                                auto
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
                                  <Dropdown.Item key={value}>
                                    {value}
                                  </Dropdown.Item>
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
                      <div className={s["products"]}>
                        <div className="d-flex flex-column">
                          {products.map(
                            (
                              {
                                name,
                                firstPhotoUrl,
                                inStock,
                                price,
                                id,
                                description,
                                creationTime,
                                rating
                              },
                              index
                            ) => (
                              <div className="my-2" key={index}>
                                <ViewProduct
                                  name={name}
                                  photoUrl={firstPhotoUrl}
                                  inStock={inStock}
                                  price={price}
                                  productId={id}
                                  textInfo={description}
                                  date={new Date(creationTime)}
                                  rating={rating}
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      {totalPages > 1 && (
                        <div className="text-center">
                          <Pagination
                            color={"success"}
                            initialPage={1}
                            total={totalPages}
                            page={currentPage}
                            onChange={(number) => setCurrentPage(number)}
                          />
                        </div>
                      )}
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
        </>
      )}
      {products !== undefined || (
        <div className="text-center">
          <Loading color="success" textColor="success" size="lg">
            Loading..
          </Loading>
        </div>
      )}
    </>
  );
}
