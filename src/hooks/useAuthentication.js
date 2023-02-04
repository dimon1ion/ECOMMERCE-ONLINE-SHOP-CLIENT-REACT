import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import ServerPath from "../enums/ServerPath";
import Token from "../enums/Token";
import getRequest from "../requests/getRequest";
import getRequestWithToken from "../requests/getRequestWithToken";
import putRequest from "../requests/putRequest";

export default function useAuthentication(props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [nameUser, setNameUser] = useState("");
  const [lastNameUser, setLastNameUser] = useState("");
  const [emailUser, setEmailUser] = useState("");

  useEffect(() => {
    checkAuthenticate();
  }, []);

  const checkAuthenticate = async () => {
    setIsAuthenticated(false);
    setNameUser("");
    setLastNameUser("");
    setLastNameUser("");
    let Atoken = getCookie(Token.ACCESTOKEN);
    if (Atoken === "") {
      const refreshLocalToken = window.localStorage.getItem(Token.REFRESHTOKEN);
      if (refreshLocalToken === null) {
        return;
      }
      const url = new URL(
        ServerPath.SERVERPATH + ServerPath.SENDREFRESHTOKEN + `/${refreshLocalToken}`
      );
      const response = putRequest(url.toString());
      if (response === null || !response.ok) {
        return;
      }
      const {accessToken, refreshToken} = await response.json();
      Atoken = accessToken;
      writeAccesToken(accessToken);
      writeRefreshToken(refreshToken);
    }
    const response = await getRequestWithToken(ServerPath.SERVERPATH + ServerPath.GETUSERINFOBYTOKEN, Atoken);
    if (response !== null && response.ok) {
      const { firstName, lastName, email } = await response.json();
      console.log(firstName, lastName, email);
      setNameUser(firstName ?? "");
      setLastNameUser(lastName ?? "");
      setLastNameUser(email ?? "");
      setIsAuthenticated(true);
    }
    
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
  }

  const writeRefreshToken = (refreshToken) => {
    window.localStorage.setItem(Token.REFRESHTOKEN, refreshToken);
  }

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

  const getInitials = () => {
    if (nameUser.length > 1 && lastNameUser.length > 1) {
      return (
        nameUser.charAt(0).toUpperCase() + lastNameUser.charAt(0).toUpperCase()
      );
    }
    return "";
  };

  const deleteCookie = (cookieName) => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

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
    emailUser,
    getInitials,
    getCookie,
    writeAccesToken,
    writeRefreshToken,
    checkAuthenticate,
    logOut
  };
}
