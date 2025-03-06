import axios from "axios";
import { ICommentType } from "./AppStores";

const instance = axios.create({
    baseURL : "https://dummyjson.com/posts"
});

export const getAllPosts = async() => {
    const response = await instance.get("/");
    const data = response.data;
    return data;
}

export const getSinglePost = async(postId : number)  =>{
    const response = await instance.get(`/${postId}`);
    const data = response.data;
    return data;
}

export const getPostComment = async(postId : number) =>{
    const response = await instance.get(`/${postId}/comments`);
    const data = response.data;
    return data;
}

export const getAllComments = async()=>{
    const response = await axios.get('https://dummyjson.com/comments?limit=0');
    const data = await response.data;

    return data;
}

export const addComment = async(comment : ICommentType)=>{
    const response = await axios.post('https://dummyjson.com/comments/add',JSON.stringify(comment),{
        headers : {"Content-Type":"application/json"}
    })
    const data = await response.data;

    return data;
}