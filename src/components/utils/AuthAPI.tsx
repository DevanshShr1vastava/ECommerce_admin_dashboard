import axios from "axios";
import { IUpdateUserInfo } from "./AppStores";

export interface IAuthResponse {
    id : number;
    username : string;
    email : string;
    firstName : string;
    lastName : string;
    gender : string;
    image : string;
    accessToken : string;
    refreshToken : string;
}

const AuthInstance = axios.create({
   baseURL : 'https://dummyjson.com/auth',
   headers : {
        'Content-Type' : 'application/json'
   }
});

export const loginAuth = async(username: string, password : string)=>{
    const response = await AuthInstance.post('/login',JSON.stringify({
        username,
        password,
        expiresInMins : 30
    }));

    const responseData = await response.data;
    return responseData;
}

export const getCurrentUser = async(token:string|null) =>{
    if(token){

        const response = await AuthInstance.get('/me',{
            headers : {
                'Authorization' : `Bearer ${token}`
            }
        });
        
        const responseData = await response.data;
        return responseData;
    }
    else{
        return "invalid user"
    }
}

export const getAllUsers = async()=>{
    const response = await axios.get("https://dummyjson.com/users");
    const data = response.data;

    return data;
}
export const getSingleUser = async(id : number)=>{
    const response = await axios.get(`https://dummyjson.com/users/${id}`);
    const data = await response.data;

    return data;
}

export const updateUser = async(id: number, data:IUpdateUserInfo )=>{
    const response = await axios.patch(`https://dummyjson.com/users/${id}`,JSON.stringify(data))
    const Resdata = await response.data;

    return Resdata;
}