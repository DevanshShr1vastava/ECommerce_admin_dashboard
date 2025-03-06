import axios from "axios"
import { IProduct } from "./AppStores";


const instance = axios.create({
    baseURL : 'https://dummyjson.com/products'
})

export const getAllProducts = async() =>{
    const response = await axios.get('https://dummyjson.com/products?limit=0');
    const data = await response.data;

    return data;
}

export const getSingleProduct = async(id:number) =>{
    const response = await instance.get(`/${id}`);
    const data = await response.data;

    return data;
}

export const getAllCategories = async()=>{
    const response = await instance.get('/category-list');
    const data = await response.data;

    return data;
}

export const addProduct = async(newProductData : IProduct )=>{
    const response = await instance.post('/add',JSON.stringify(newProductData));
    const data = await response.data;
    return data;
}

export interface IUpdateFormData {
    id : number;
    title: string;
    description: string;
    category: string;
    price: number;
    rating: number;
    stock: number;
    brand: string;
    minimumOrderQuantity: number;
    images: string[];
}

export const updateProduct = async (id: number, prodData: Partial<IUpdateFormData>) => {
    const response = await instance.patch(`/${id}`, JSON.stringify(prodData));
    return response.data;
  };
  

export const deleteProduct = async(id:number) =>{
    const response = await instance.delete(`/${id}`);
    const data = await response.data;

    return data;
}
