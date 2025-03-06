import axios from "axios";
import { ICartData, ICartProduct } from "./AppStores";

const instance = axios.create({
    baseURL : "https://dummyjson.com/carts"
});

export const getAllCarts = async()=>{
    const response = await instance.get("/");
    const data = await response.data;
    return data;
}

export const getSingleCart = async():Promise<ICartData> =>{
    const response = await instance.get(`/1`);
    const data = await response.data;

    return data;
}

export const addNewCart = async(userID : number, products : ICartProduct ) =>{
    const response = await instance.post('/add', {id:userID, products});
    const data = await response.data;
    return data;
}

export const updateCart = async(products : ICartProduct[]) =>{
    const response = await instance.patch('/1',{
        merge : true,
        products 
    })
    const data = await response.data;

    return data;
}

export const deleteCart = async()=>{
    const response = await instance.delete('/1');
    const data = await response.data;

    return data;
}

