import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import ServerPath from "../enums/ServerPath";
import Token from "../enums/Token";
import getRequest from "../requests/getRequest";
import getRequestWithToken from "../requests/getRequestWithToken";

export default function useAuthentication(props) {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [nameUser, setNameUser] = useState("");
  const [lastNameUser, setLastNameUser] = useState("");
  const [middleNameUser, setMiddleNameUser] = useState("");
  const [emailUser, setEmailUser] = useState("");
  const [phoneNumberUser, setPhoneNumberUser] = useState("");

  useEffect(() => {
    checkAuthenticate();
  }, []);

  const reloadToken = async () => {
    const refreshLocalToken = window.localStorage.getItem(Token.REFRESHTOKEN);
    if (refreshLocalToken === null) {
      setIsAuthenticated(false);
      return;
    }
    const url = new URL(
      ServerPath.SERVERPATH +
        ServerPath.SENDREFRESHTOKEN +
        `/${refreshLocalToken}`
    );
    const response = await getRequest(url.toString());
    if (response === null || !response.ok) {
      setIsAuthenticated(false);
      return;
    }
    const { accessToken, refreshToken } = await response.json();
    writeAccesToken(accessToken);
    writeRefreshToken(refreshToken);
  };

  const checkAuthenticate = async () => {
    setIsAuthenticated(undefined);
    setNameUser("");
    setLastNameUser("");
    setLastNameUser("");
    let Atoken = getToken();
    if (Atoken === "") {
      const refreshLocalToken = window.localStorage.getItem(Token.REFRESHTOKEN);
      if (refreshLocalToken === null) {
        setIsAuthenticated(false);
        return;
      }
      const url = new URL(
        ServerPath.SERVERPATH +
          ServerPath.SENDREFRESHTOKEN +
          `/${refreshLocalToken}`
      );
      const response = await getRequest(url.toString());
      if (response === null || !response.ok) {
        setIsAuthenticated(false);
        return;
      }
      const { accessToken, refreshToken } = await response.json();
      Atoken = accessToken;
      writeAccesToken(accessToken);
      writeRefreshToken(refreshToken);
    }

    initUserInfo(Atoken);
  };

  const initUserInfo = async (Atoken = undefined) => {
    if (Atoken === undefined) {
      Atoken = getToken();
    }
    const response = await getRequestWithToken(
      ServerPath.SERVERPATH + ServerPath.GETUSERINFOBYTOKEN,
      Atoken
    );
    if (response === null || !response.ok) {
      setIsAuthenticated(false);
      return;
    }
    const { firstName, lastName, email, middleName, phoneNumber } = await response.json();
    setNameUser(firstName ?? "");
    setLastNameUser(lastName ?? "");
    setMiddleNameUser(middleName ?? "");
    setEmailUser(email ?? "");
    setPhoneNumberUser(phoneNumber ?? "");
    setIsAuthenticated(true);
  };

  // const updateToken = async () => {
  //   const refreshLocalToken = window.localStorage.getItem(Token.REFRESHTOKEN);
  //   if (refreshLocalToken === null) {
  //     return null;
  //   }
  //   const url = new URL(
  //     ServerPath.SERVERPATH + ServerPath.SENDREFRESHTOKEN + `/${refreshLocalToken}`
  //   );
  //   const response = putRequest(url.toString());
  //   if (response === null || !response.ok) {
  //     return null;
  //   }
  //   const {accessToken, refreshToken} = await response.json();
  //   writeAccesToken(accessToken);
  //   writeRefreshToken(refreshToken);
  //   return accessToken;
  // }

  const writeAccesToken = (accessToken) => {
    try {
      const Atoken = jwtDecode(accessToken);
      const expDate = new Date(+Atoken.exp * 1000);
      document.cookie = `${
        Token.ACCESTOKEN
      }=${accessToken};expires=${expDate.toUTCString()}`;
    } catch (error) {
      return false;
    }
    return true;
  };

  const writeRefreshToken = (refreshToken) => {
    window.localStorage.setItem(Token.REFRESHTOKEN, refreshToken);
  };

  const getCookie = (cookieName) => {
    let name = cookieName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };

  const getToken = () => {
    return getCookie(Token.ACCESTOKEN);
  };

  const getInitials = () => {
    if (nameUser.length > 1 && lastNameUser.length > 1) {
      return (
        nameUser.charAt(0).toUpperCase() + lastNameUser.charAt(0).toUpperCase()
      );
    }
    return "";
  };

  const deleteCookie = (cookieName) => {
    document.cookie = `${cookieName}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`;
  };

  const deleteRefreshToken = () => {
    const refreshToken = window.localStorage.getItem(Token.REFRESHTOKEN);
    if (refreshToken !== null) {
      getRequest(
        ServerPath.SERVERPATH + ServerPath.LOGOUTUSER + `/${refreshToken}`
      );
      window.localStorage.removeItem(Token.REFRESHTOKEN);
    }
  }

  const logOut = () => {
    deleteCookie(Token.ACCESTOKEN);
    const refreshToken = window.localStorage.getItem(Token.REFRESHTOKEN);
    if (refreshToken !== null) {
      getRequest(
        ServerPath.SERVERPATH + ServerPath.LOGOUTUSER + `/${refreshToken}`
      );
      window.localStorage.removeItem(Token.REFRESHTOKEN);
    }
    setIsAuthenticated(false);
    setNameUser("");
    setLastNameUser("");
    setLastNameUser("");
  };

  return {
    isAuthenticated,
    nameUser,
    lastNameUser,
    middleNameUser,
    emailUser,
    phoneNumberUser,
    getInitials,
    getCookie,
    getToken,
    writeAccesToken,
    writeRefreshToken,
    checkAuthenticate,
    reloadToken,
    deleteRefreshToken,
    logOut,
  };
}
