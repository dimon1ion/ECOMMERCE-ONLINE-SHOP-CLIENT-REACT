import { createContext } from "react";

const AuthenticationContext = createContext({
  isAuthenticated: false,
  nameUser: "",
  lastNameUser: "",
  middleNameUser: "",
  emailUser: "",
  phoneNumberUser: "",
  getInitials: () => "",
  getCookie: () => "",
  getToken: () => "",
  writeAccesToken: (accessToken) => false,
  writeRefreshToken: (refreshToken) => {},
  checkAuthenticate: () => {},
  reloadToken: async () => {},
  deleteRefreshToken: () => {},
  logOut: () => {},
});

export default AuthenticationContext;
