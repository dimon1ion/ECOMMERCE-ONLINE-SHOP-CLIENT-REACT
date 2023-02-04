export default class ServerPath{
    static get SERVERPATH() { return "https://itstep-ecommerce.azurewebsites.net"; };
    static get LOGIN() { return "/api/Auth/login"; };
    static get REGISTRATION() { return "/api/Auth/userreg"; };
    static get GETALLCATEGORIES() { return "/api/Category/getall"; };
    static get SENDREFRESHTOKEN() { return "/api/Auth/refresh"; };
    static get LOGOUTUSER() { return "/api/Auth/logout"; };
    static get GETSORTING() { return "/api/Product/sorting"; };
    static get GETUSERINFOBYTOKEN() { return "/api/Profile/returnMyInfo"; };
    static get GETPRODUCTSBYTITLE() { return "/api/Product/title"; };
}