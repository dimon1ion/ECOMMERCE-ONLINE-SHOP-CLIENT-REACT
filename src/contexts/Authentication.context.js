import { createContext } from "react";

const AuthenticationContext = createContext({
  isAuthenticated: false,
  nameUser: "",
  lastNameUser: "",
  emailUser: "",
  getInitials: () => "",
  getCookie: () => "",
  writeAccesToken: (accessToken) => false,
  writeRefreshToken: (refreshToken) => {},
  checkAuthenticate: () => {},
  logOut: () => {},
});

export default AuthenticationContext;
