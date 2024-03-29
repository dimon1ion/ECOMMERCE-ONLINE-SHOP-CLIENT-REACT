export default class ServerPath{
    static get SERVERPATH() { return "https://trade-az.azurewebsites.net"; };
    static get LOGIN() { return "/api/Auth/login"; };
    static get REGISTRATION() { return "/api/Auth/userreg"; };
    static get GETALLCATEGORIES() { return "/api/Category/getall"; };
    static get SENDREFRESHTOKEN() { return "/api/Auth/refresh"; };
    static get LOGOUTUSER() { return "/api/Auth/logout"; };
    static get GETSORTING() { return "/api/Product/sorting"; };
    static get GETUSERINFOBYTOKEN() { return "/api/Profile/returnMyInfo"; };
    static get GETPRODUCTSBYTITLE() { return "/api/Product/title"; };
    static get GETPRODUCTSBYCATEGORIEID() { return "/api/Product/category"; };
    static get GETPRODUCTSBYSELLERID() { return "/api/Product/seller"; };
    static get GETPRODUCTBYID() { return "/api/Product"; };
    static get GETREVIEWSBYPRODUCTID() { return "/api/Review/product"; };
    static get ADDREVIEW() { return "/api/Review/add"; };
    static get GETCART() { return "/api/Cart/get_own"; };
    static get CHANGECOUNTPRODUCTSINCART() { return "/api/Cart/change"; };
    static get GETADDRESSES() { return "/api/Address/get_own"; };
    static get GETCITIES() { return "/api/City/get"; };
    static get PUTADDRESS() { return "/api/Address/edit"; };
    static get ADDADDRESS() { return "/api/Address/add"; };
    static get CHANGEEMAIL() { return "/api/Auth/changemail"; };
    static get DELETEADDRESS() { return "/api/Address/delete"; };
    static get CHANGEPASSWORD() { return "/api/Auth/changepassword"; };
    static get CHANGEPHONE() { return "/api/Auth/changephone"; };
    static get CHANGEUSERINFO() { return "/api/Profile/changeMyInfo"; };
    static get ADDORDER() { return "/api/Order/addFromCart"; };
    static get GETORDERS() { return "/api/Order/getOwn"; };
    static get GETOORDERSTATUSES() { return "/api/Order/states"; };
    static get RESETPASSWORD() { return "/api/Auth/forgotpassword"; };
}