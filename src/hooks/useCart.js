import { useEffect, useState } from "react";
import ServerPath from "../enums/ServerPath";
import getRequestWithToken from "../requests/getRequestWithToken";
import postRequestForm from "../requests/postRequestForm";
import request from "../requests/request";

export default function useCart(isAuthenticated, getToken, reloadToken){
    const [cart, setCart] = useState([]);
    const [countProducts, setCountProducts] = useState(0);

    useEffect(() => {
        if (isAuthenticated) {
            initCart();
        }
        else{
            setCart([]);
            setCountProducts(0);
        }
    }, [isAuthenticated])
    
    const initCart = async () => {
        const response = await getRequestWithToken(ServerPath.SERVERPATH + ServerPath.GETCART, getToken());
        if (response === null || !response.ok) {
            return;
        }
        const { $values:products } = await response.json();
        console.log(products);
        setCountProducts(products.length);
        setCart(products);
    }

    const addToCart = async (productId) => {
        return await changeCountProductInCart(productId, 1);
    }

    const removeFromCart = async (productId) => {
        return await changeCountProductInCart(productId, 0);
    }

    const changeCountProductInCart = async (productId, count) => {
        console.log("ZAPROSSS");
        if (isAuthenticated) {
            const url = new URL(ServerPath.SERVERPATH + ServerPath.CHANGECOUNTPRODUCTSINCART);
            url.searchParams.append("guid", productId);
            url.searchParams.append("quantity", count);
            const response = await request("POST", url.toString(), null, null, getToken());
            if (response === null) {
                return false;
            } else if(response.status === 401){
                await reloadToken();
                if (isAuthenticated === false) {
                    return;
                }
                await changeCountProductInCart();
                return;
            }
            await initCart();
            return true;
        }
        return false;
    }

    const findProductById = (productId) => {
        console.log(productId);
        return cart.find(({product:{id}}) => {
            console.log(id, id === productId);
            return id === productId
        });
    }

    return { cart, countProducts, addToCart, removeFromCart, changeCountProductInCart, findProductById, initCart }
}