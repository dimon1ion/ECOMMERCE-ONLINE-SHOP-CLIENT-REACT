import s from "./Profile.module.scss";
import backImage from "../../assets/styles/backImage.module.scss";
import Navigation from "../../components/Navigation";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button, Grid, Popover, Row, Text } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import AuthenticationContext from "../../contexts/Authentication.context";
import userImage from "../../assets/Images/defaultUser.png";
import cartImage from "../../assets/Images/cart_black_icon.svg";
import historyIcon from "../../assets/Images/history_icon.svg";
import settingsIcon from "../../assets/Images/settings_icon.svg";

export default function Profile(props) {
  const activeLink = ({ isActive }) =>
    `${s["nav-link"]} ${isActive ? s["active"] : ""}`;

  const [navigation, setNavigation] = useState([
    { name: "Home", ref: "/home" },
    { name: "My Profile" },
  ]);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const navigate = useNavigate();

  const { isAuthenticated, nameUser, lastNameUser, middleNameUser, logOut } =
    useContext(AuthenticationContext);

  useEffect(() => {
    if (isAuthenticated !== undefined && !isAuthenticated) {
      navigate("/notfound");
    }
  }, [isAuthenticated]);

  return (
    <>
      {isAuthenticated && (
        <>
          <section
            className={`${backImage["back-image"]} ${s["product_page"]}`}
          >
            <div className="container">
              <Navigation navigationArr={navigation} />
              <div className={`${s["white-block"]}`}>
                <div className={`row ${s["hello_block"]}`}>
                  <div className="col-10">
                    <div className={`${s["profile"]} d-flex`}>
                      <img
                        src={userImage}
                        alt=""
                        className={s["profile__image"]}
                      />
                      <div className={s["profile__name"]}>
                        <h1 className={s["hello_header"]}>
                          Hello,
                          <span className={s["name"]}>
                            {nameUser} {lastNameUser} {middleNameUser}
                          </span>
                        </h1>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col"></div> */}
                </div>
                <div className={`${s["navigation"]} d-flex flex-column justify-content-center flex-md-row justify-content-md-start flex-md-wrap`}>
                  <div className={`${s["nav-button"]}`}>
                    <Button
                      className={`${s["link__button"]}`}
                      icon={
                        <img
                          src={settingsIcon}
                          alt=""
                          className={s["icon_image"]}
                        />
                      }
                      light
                      auto
                      onPress={() => {
                        navigate("details");
                      }}
                    >
                      <NavLink to={"details"} className={activeLink}>
                        Profile Details
                      </NavLink>
                    </Button>
                  </div>
                  <div className={`${s["nav-button"]}`}>
                    <Button
                      className={`${s["link__button"]}`}
                      icon={<img src={cartImage} className={s["icon_image"]} />}
                      light
                      auto
                      onPress={() => {
                        navigate("cart");
                      }}
                    >
                      <NavLink to={"cart"} className={activeLink}>
                      Cart
                      </NavLink>
                    </Button>
                  </div>
                  <div className={`${s["nav-button"]}`}>
                    <Button
                      className={`${s["link__button"]}`}
                      icon={
                        <img src={historyIcon} className={s["icon_image"]} />
                      }
                      light
                      auto
                      onPress={() => {
                        navigate("history");
                      }}
                    >
                      <NavLink to={"history"} className={activeLink}>
                      Order history
                      </NavLink>
                    </Button>
                  </div>
                  <div className={`${s["nav-button"]}`}>
                    <Button
                      className={`${s["button"]} ${s["secondary"]}`}
                      color={"secondary"}
                      flat
                      auto
                      onPress={() => {
                        navigate("/login");
                      }}
                    >
                      <NavLink to={"/login"} className={activeLink}>
                        Change account
                      </NavLink>
                    </Button>
                  </div>
                  <div>
                    <Popover isOpen={isOpenDeleteModal} onOpenChange={setIsOpenDeleteModal}>
                      <Popover.Trigger>
                        <Button
                          className={s["button"]}
                          color={"error"}
                          flat
                          auto
                        >
                          Close account
                        </Button>
                      </Popover.Trigger>
                      <Popover.Content>
                        <Grid.Container
                          css={{
                            borderRadius: "14px",
                            padding: "0.75rem",
                            maxWidth: "330px",
                          }}
                        >
                          <Row justify="center" align="center">
                            <Text b>Confirm</Text>
                          </Row>
                          <Row>
                            <Text>
                              {/* Are you sure you want to delete this user? By
                              doing this, you will not be able to recover the
                              data. */}
                              Are you sure you want to sign out?
                            </Text>
                          </Row>
                          <Grid.Container
                            justify="space-between"
                            alignContent="center"
                          >
                            <Grid>
                              <Button size="sm" light onPress={() => setIsOpenDeleteModal(false)}>
                                Cancel
                              </Button>
                            </Grid>
                            <Grid>
                              <Button size="sm" shadow onPress={() => {
                                logOut();
                                navigate("/products");
                              }} color="error">
                                {/* Delete */}
                                Yes
                              </Button>
                            </Grid>
                          </Grid.Container>
                        </Grid.Container>
                      </Popover.Content>
                    </Popover>
                  </div>
                  {/* <NavLink to={"/profile/details"} className={activeLink}>
                    <Button className={s["delete_button"]} flat auto></Button>
                  </NavLink> */}
                </div>
              </div>
                <Outlet />
            </div>
          </section>
        </>
      )}
    </>
  );
}
