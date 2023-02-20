import s from "./Product.module.scss";
import cartImage from "../../assets/Images/cart_icon.svg";
import backImage from "../../assets/styles/backImage.module.scss";
import Navigation from "../../components/Navigation";
import { useContext, useEffect, useState } from "react";
import {
  NavLink,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import ServerPath from "../../enums/ServerPath";
import Search from "../../components/Search/Search";
import { Carousel } from "react-carousel-minimal";
import useToggle from "../../hooks/useToggle";
import {
  Avatar,
  Button,
  Checkbox,
  Loading,
  Modal,
  Pagination,
  Row,
  Text,
  Input,
  Textarea,
  Col,
} from "@nextui-org/react";
import printIcon from "../../assets/Images/print_text_icon.svg";
import userPlusIcon from "../../assets/Images/user_plus_icon.svg";
import reviewIcon from "../../assets/Images/review_icon.svg";
import arrowRightIcon from "../../assets/Images/arrow_right_icon.svg";
import arrowLeftIcon from "../../assets/Images/arrow_left_icon.svg";
import reloadIcon from "../../assets/Images/update_arrow_icon.svg";
import ViewProduct from "../../components/ViewProduct/ViewProduct";
import usePagination from "../../hooks/usePagination";
import getRequest from "../../requests/getRequest";
import RatingComponent from "../../components/RatingComponent/RatingComponent";
import AuthenticationContext from "../../contexts/Authentication.context";
import TextMore from "../../ui/TextMore/TextMore";
import { ScrollingCarousel } from "@trendyol-js/react-carousel";
import ZoomImage from "../../ui/ZoomImage/ZoomImage";
import postRequestForm from "../../requests/postRequestForm";
import ErrorMessage from "../../ui/ErrorMessage";
import CartContext from "../../contexts/Cart.context";
import Banner from "../../ui/Banner/Banner";

export default function Product(props) {
  const [navigation, setNavigation] = useState([]);
  const [productInfo, setProductInfo] = useState(undefined);
  const [images, setImages] = useState([]);
  const { isOpen: showPhoneNumber, toggle: toggleShowPhoneNumber } =
    useToggle(false);
  const [reviews, setReviews] = useState([]);
  const [productRating, setProductRating] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [productHasInCart, setProductHasInCart] = useState(false);
  const [recommendProducts, setRecommendProducts] = useState([]);
  // Modal
  const [visible, setVisible] = useState(false);

  const [addReviewRating, setAddReviewRating] = useState(0);
  const [addReviewText, setAddReviewText] = useState("");
  const [addReviewImages, setAddReviewImages] = useState([]);
  const [addReviewIsError, setAddReviewIsError] = useState(false);
  const [addReviewErrorMessage, setAddReviewErrorMessage] = useState("");
  const [isLoadingAddingReview, setIsLoadingAddingReview] = useState(false);
  const [isLoadingAddingToCart, setIsLoadingAddingToCart] = useState(false);

  const {
    currentPage,
    offset,
    totalPages,
    setTotalPages,
    decrement,
    increment,
    setCurrentPage,
  } = usePagination(1, 5);

  const { checkAuthenticate, isAuthenticated, getToken } = useContext(
    AuthenticationContext
  );
  const { cart, findProductById, addToCart } = useContext(CartContext);

  const { id: productId } = useParams();
  const navigate = useNavigate();
  // const [query, setQuery] = useSearchParams();

  useEffect(() => {
    window.scroll(0, 0);
    initialize();
    setCurrentPage(1);
    // const qCategory = query.get("productId");
  }, [productId]);

  useEffect(() => {
    setProductHasInCart(findProductById(productId) !== undefined);
  }, [productId, cart]);

  useEffect(() => {
    initProductReviews();
  }, [productId, currentPage]);

  const initialize = async () => {
    const nav = [{ name: "Home", ref: "/home" }];
    const response = await getRequest(
      ServerPath.SERVERPATH + ServerPath.GETPRODUCTBYID + `/${productId}`
    );
    console.log(response);
    if (response === null || !response.ok) {
      navigate("/notfound");
      return;
    }
    const data = await response.json();
    console.log("----Request----");
    if (data.name !== undefined) {
      nav.push({
        name: data.category?.name,
        ref: `/products?categoryId=${data.category?.id}`,
      });
      nav.push({ name: data.name });
    }
    setNavigation(nav);
    setImages(data.productPhotos?.$values?.map(({ url }) => ({ image: url })));
    await getRecommendProducts(data);
    setProductInfo(data);
  };

  const getRecommendProducts = async (productInfo, countProducts = 6) => {
    const url = new URL(
      ServerPath.SERVERPATH +
        ServerPath.GETPRODUCTSBYCATEGORIEID +
        `/${productInfo.category?.id}`
    );
    url.searchParams.append("onPage", countProducts);
    const response = await getRequest(url.toString());
    if (response === null || !response.ok) {
      return;
    }
    const {
      products: { $values: products },
    } = await response.json();

    console.log(products);
    const arrResultProducts = [];
    for (
      let index = 0;
      index < countProducts - 1 && index < products.length;
      index++
    ) {
      if (products[index].id !== productId) {
        arrResultProducts.push(products[index]);
      }
    }
    console.log(arrResultProducts);
    setRecommendProducts(arrResultProducts);
  };

  const initProductReviews = async () => {
    const url = new URL(
      ServerPath.SERVERPATH + ServerPath.GETREVIEWSBYPRODUCTID + `/${productId}`
    );
    const { searchParams } = url;
    searchParams.append("page", currentPage);
    searchParams.append("onPage", offset);
    console.log(url.toString());
    const responseReviews = await getRequest(url.toString());

    console.log(responseReviews);
    if (responseReviews === null || !responseReviews.ok) {
      return;
    }
    const {
      totalPageCount,
      reviews: { $values },
      rating,
    } = await responseReviews.json();
    setTotalPages(totalPageCount);
    setReviews($values);
    setProductRating(rating);
  };

  const reloadReviews = async () => {
    setIsLoadingReview(true);
    await initProductReviews();
    setIsLoadingReview(false);
  };

  const addReview = async () => {
    setIsLoadingAddingReview(true);
    setAddReviewIsError(false);
    if (addReviewRating === 0) {
      setAddReviewErrorMessage("choose rating");
    } else if (addReviewText === "") {
      setAddReviewErrorMessage("Text is empty");
    } else {
      const formData = new FormData();
      formData.append("ProductId", productId);
      formData.append("Rating", addReviewRating);
      formData.append("Text", addReviewText);
      addReviewImages.forEach((image) => {
        if (image !== null) {
          formData.append("Photos", image, image.name);
        }
      });
      let response = await postRequestForm(
        ServerPath.SERVERPATH + ServerPath.ADDREVIEW,
        formData,
        getToken()
      );
      if (response.status === 401) {
        await checkAuthenticate();
        if (isAuthenticated === false) {
          window.location.reload();
          return;
        }
        response = await postRequestForm(
          ServerPath.SERVERPATH + ServerPath.ADDREVIEW,
          formData,
          getToken()
        );
      }
      if (response !== null && response.ok) {
        reloadReviews();
        closeHandler();
        setIsLoadingAddingReview(true);
        return;
      } else if (response !== null) {
        const data = await response.json();
        if (data["error_message"]) {
          setAddReviewErrorMessage(data["error_message"]);
        }
      } else {
        setAddReviewErrorMessage("This feature is temporarily unavailable");
      }
    }
    setAddReviewIsError(true);
    setIsLoadingAddingReview(false);
  };

  const addProductToCart = async () => {
    await addToCart(productId);
  };

  const handler = () => setVisible(true);

  const closeHandler = async () => {
    setIsLoadingAddingToCart(true);
    const res = await setVisible(false);
    console.log(res);
    setIsLoadingAddingToCart(false);
  };

  return (
    <>
      {productInfo && (
        <section className={`${backImage["back-image"]} ${s["product_page"]}`}>
          <div className="container">
            <Navigation navigationArr={navigation} />
            <div className={s["no-print"]}>
              <Search />
            </div>
            <div className={`${s["white-block"]} ${s["main_info"]}`}>
              <div className={`row`}>
                <div className={`col-12 col-md-7 ${s["fade"]}`}>
                  {/* <ReactImageGallery autoPlay={true} items={images}/> */}
                  <Carousel
                    data={images}
                    width="100%"
                    radius="10px"
                    slideBackgroundColor="#bdbfbc"
                    slideImageFit="contain"
                    thumbnails={true}
                    thumbnailWidth="100px"
                    dots={true}
                    style={{
                      textAlign: "center",
                    }}
                  />
                </div>
                <div className={`col ${s["short_info"]}`}>
                  <h2 className={s["price"]}>{productInfo.price} ₼</h2>
                  <h1 className={s["title"]}>{productInfo.name}</h1>
                  <div className={s["reviews__rating"]}>
                    <RatingComponent rating={productRating} />
                  </div>
                  <div className={s["author"]}>
                    Offered by:
                    <a
                      href={productInfo.seller?.websiteUrl ?? "#"}
                      target="_blank"
                    >
                      {productInfo.seller.companyName ?? "Empty"}
                    </a>
                  </div>
                  <div className={`${s["category"]} my-1`}>
                    Category:
                    <NavLink
                      to={`/products?categoryId=${productInfo.category?.id}`}
                      className={s["link"]}
                    >
                      {productInfo.category.name ?? "Empty"}
                    </NavLink>
                  </div>
                  <Button
                    shadow={!productHasInCart && productInfo.inStock}
                    bordered={productHasInCart || !productInfo.inStock}
                    disabled={isLoadingAddingToCart || !productInfo.inStock}
                    color={"success"}
                    icon={<img src={cartImage} className={s["image"]} />}
                    className={`${s["add-cart"]} ${s["no-print"]} mt-2 w-100`}
                    onPress={() => {
                      if (productHasInCart) {
                        navigate("/profile/cart");
                        return;
                      }
                      if (!isAuthenticated) {
                        navigate("/login");
                        return;
                      }
                      addProductToCart();
                    }}
                  >
                    {!productInfo.inStock
                      ? "Not available"
                      : productHasInCart
                      ? "In Cart"
                      : "Add to Cart"}
                  </Button>

                  <div className={s["contacts"]}>
                    <h4 className={s["contacts__title"]}>Contact with</h4>
                    <div>
                      <button
                        className={`${s["my-btn"]} ${s["btn-orange"]} ${s["contacts__phone__button"]}`}
                        onClick={toggleShowPhoneNumber}
                      >
                        <i className={`${s["contacts__phone_image"]}`}></i>
                        {showPhoneNumber ? (
                          <>{productInfo?.seller?.phoneNumber ?? "empty"}</>
                        ) : (
                          <>Click to show phone number</>
                        )}
                      </button>
                    </div>
                    <div>
                      <a
                        href={`mailto:${productInfo?.seller?.email ?? "empty"}`}
                        className={`${s["ref"]} ${s["my-btn"]} ${s["btn-blue"]} ${s["contacts__phone__button"]}`}
                      >
                        <i
                          className={`${s["contacts__mail_image"]}`}
                          style={{ marginBottom: "-4px" }}
                        ></i>
                        Write to mail
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${s["additional_info_block"]} row`}>
              <div
                className={`col-12 col-lg-8 ${s["white-block"]} ${s["description"]}`}
              >
                <h4 className={s["description__title"]}>Description</h4>
                <p
                  className={s["description__text"]}
                  dangerouslySetInnerHTML={{
                    __html: productInfo.description ?? "empty",
                  }}
                ></p>
              </div>
              <div className={`col ${s["white-block"]} ${s["short-commands"]}`}>
                <h4 className={s["short-commands__title"]}>Short commands</h4>
                <ul className={s["short-commands__list"]}>
                  <li>
                    <Button
                      ghost
                      icon={
                        <img src={printIcon} className={s["list__image"]}></img>
                      }
                      color="primary"
                      className={s["list__button"]}
                      onClick={() => window.print()}
                    >
                      Print this product
                    </Button>
                  </li>
                  <li>
                    <Button
                      ghost
                      icon={
                        <img
                          src={userPlusIcon}
                          className={s["list__image"]}
                        ></img>
                      }
                      color="gradient"
                      className={`${s["list__button"]} ${s["list__button__seller"]}`}
                      onClick={() => {
                        navigate(
                          `/products?sellerId=${productInfo.seller?.id}`
                        );
                        window.scrollTo(0, 0);
                      }}
                    >
                      More products by{" "}
                      {productInfo.seller?.companyName ?? "Empty"}
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
            <div className={`row ${s["no-print"]}`}>
              <div className={`${s["white-block"]} ${s["reviews"]}`}>
                <div className="d-flex flex-column flex-sm-row justify-content-sm-between">
                  <h4 className={`${s["reviews__title"]}`}>
                    Product rating and reviews
                  </h4>
                  <div className="d-none d-sm-flex">
                    {isAuthenticated && (
                      <Button
                        ghost
                        icon={
                          <img
                            src={reviewIcon}
                            className={s["reviews__button_add__image"]}
                          ></img>
                        }
                        onPress={handler}
                        color="secondary"
                        className={` ${s["reviews__button_add"]} ${s["list__button__seller"]}`}
                      >
                        Add review
                      </Button>
                    )}
                    <Button
                      color="gradient"
                      auto
                      onPress={reloadReviews}
                      disabled={isLoadingReview}
                    >
                      {isLoadingReview ? (
                        <Loading type="points" color="currentColor" size="sm" />
                      ) : (
                        <img
                          src={reloadIcon}
                          className={s["reviews__button_reload__image"]}
                        ></img>
                      )}
                    </Button>
                  </div>
                </div>
                <div className={s["reviews__rating"]}>
                  <RatingComponent rating={productRating} />
                </div>
                <div className="d-flex d-sm-none my-2 justify-content-end">
                  {isAuthenticated && (
                    <Button
                      ghost
                      icon={
                        <img
                          src={reviewIcon}
                          className={s["reviews__button_add__image"]}
                        ></img>
                      }
                      onPress={handler}
                      color="secondary"
                      className={`${s["reviews__button_add"]} ${s["list__button__seller"]} w-100`}
                      // onClick={() => }}
                    >
                      Add review
                    </Button>
                  )}
                  <Button
                    color="gradient"
                    auto
                    onPress={reloadReviews}
                    disabled={isLoadingReview}
                  >
                    {isLoadingReview ? (
                      <Loading type="points" color="currentColor" size="sm" />
                    ) : (
                      <img
                        src={reloadIcon}
                        className={s["reviews__button_reload__image"]}
                      ></img>
                    )}
                  </Button>
                </div>
                {reviews.map(
                  (
                    {
                      initials,
                      buyerName,
                      quality,
                      reviewText,
                      photos: { $values },
                    },
                    index
                  ) => {
                    return (
                      <div key={index} className={s["reviews__review"]}>
                        <div className={s["review__profile"]}>
                          <div className="d-flex">
                            <div className={s["review__profile__avatar"]}>
                              <Avatar text={initials} size="xl" />
                            </div>
                            <div
                              className={`${s["review__profile__name_rating"]} d-flex flex-column justify-content-between`}
                            >
                              <div className={s["review__profile__name"]}>
                                {buyerName}
                              </div>
                              <div className={s["review__profile__rating"]}>
                                <RatingComponent rating={quality} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={s["review__text"]}>
                          <TextMore
                            text={reviewText}
                            maxSymbols={200}
                            showButton
                          />
                        </div>
                        <div className={s["review__photos"]}>
                          <ScrollingCarousel
                            className={s["review__photos__carousel"]}
                            rightIcon={
                              <div
                                className={`${s["arrow_block"]} ${s["right"]}`}
                              >
                                <img
                                  className={`${s["arrow"]} ${s["right"]}`}
                                  src={arrowRightIcon}
                                ></img>
                              </div>
                            }
                            leftIcon={
                              <div
                                className={`${s["arrow_block"]} ${s["left"]}`}
                              >
                                <img
                                  className={`${s["arrow"]} ${s["left"]}`}
                                  src={arrowLeftIcon}
                                ></img>
                              </div>
                            }
                            useArrowKeys={true}
                          >
                            {$values.map((item, index) => (
                              <ZoomImage
                                key={index}
                                src={item}
                                alt=""
                                className={s["review__photo"]}
                              />
                            ))}
                          </ScrollingCarousel>
                        </div>
                      </div>
                    );
                  }
                )}
                {totalPages > 1 && (
                  <div className="text-center">
                    <Pagination
                      color={"success"}
                      initialPage={1}
                      page={currentPage}
                      total={totalPages}
                      onChange={(number) => setCurrentPage(number)}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className={`row ${s["recommend-products"]} ${s["no-print"]}`}>
              <div
                className={`col-12 col-md-8 ${s["white-block"]} ${s["recommend-products__list"]}`}
              >
                <h4>Recommended products for you</h4>
                <hr />
                <div className="d-flex flex-column">
                  {recommendProducts.map(
                    (
                      {
                        name,
                        inStock,
                        firstPhotoUrl,
                        price,
                        description,
                        creationTime,
                        rating,
                        id,
                      },
                      index
                    ) => (
                      <div className="my-2" key={index}>
                        <ViewProduct
                          name={name}
                          inStock={inStock}
                          photoUrl={firstPhotoUrl}
                          price={price}
                          textInfo={description}
                          date={new Date(creationTime)}
                          productId={id}
                          rating={rating}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
              <div
                className={`col ${s["white-block"]} ${s["recommend-products__banner"]}`}
              >
                <Banner />
              </div>
            </div>
          </div>
          <nav className={`${s["post-rek"]} ${s["no-print"]}`}>
            <div className={`d-flex ${s["background"]}`}>
              <div className="container text-center">
                <h2 className="">
                  Our sales platform is one of the best platforms!
                </h2>
                <h4 className="">Developers' words</h4>
              </div>
            </div>
          </nav>
        </section>
      )}
      {productInfo !== undefined || (
        <div className="text-center">
          <Loading color="success" textColor="success" size="lg">
            Loading..
          </Loading>
        </div>
      )}
      <Modal
        closeButton
        scroll
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text size={18}>Adding a review</Text>
        </Modal.Header>
        <Modal.Body>
          <Text size={18}>Choose rating</Text>
          <RatingComponent
            rating={addReviewRating}
            setRating={setAddReviewRating}
            changeable
          />
          <Textarea
            label="Write your review"
            placeholder="Write whatever you think"
            onChange={(event) => setAddReviewText(event.target.value)}
          />
          {addReviewImages.map((item) => (
            <Input
              clearable
              bordered
              fullWidth
              color="primary"
              size="lg"
              placeholder="Image"
              accept={"image/*"}
              type={"file"}
              value={item}
            />
          ))}
          <Row justify="space-between">
            <Button
              flat
              auto
              color="secondary"
              className={s["add_review_image_button"]}
              onPress={() => setAddReviewImages([...addReviewImages, null])}
            >
              Add image
            </Button>
            {addReviewImages.length > 0 && (
              <Button
                flat
                auto
                color="error"
                className={s["add_review_image_button"]}
                onPress={() =>
                  setAddReviewImages(
                    [...addReviewImages].slice(0, addReviewImages.length - 1)
                  )
                }
              >
                Delete last image
              </Button>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <ErrorMessage show={!addReviewIsError}>
            {addReviewErrorMessage}
          </ErrorMessage>
          <Button auto flat color="error" onPress={closeHandler}>
            Close
          </Button>
          <Button auto onPress={addReview} disabled={isLoadingAddingReview}>
            {isLoadingAddingReview ? (
              <Loading type="points" color="currentColor" size="sm" />
            ) : (
              <>Send</>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
