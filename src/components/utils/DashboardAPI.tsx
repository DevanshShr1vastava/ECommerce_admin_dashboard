import axios from "axios";

const instance = axios.create({
    baseURL : 'https://dummyjson.com/'
})

export const getRecipes = async()=>{
    const response = await instance.get("/recipes?limit=10&skip=5");
    const data = await response.data;

    return data;
}

export const getQuotes = async()=>{
    const response = await instance.get('/quotes?limit=5&skip=3')
    const data = await response.data;

    return data;
}