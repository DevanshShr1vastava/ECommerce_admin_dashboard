import { useEffect } from "react";
import { authToken } from "../utils/AppStores";
import { useNavigate } from "react-router";

const Logout = () => {
  const token = authToken();
  const navigate = useNavigate();
  useEffect(()=>{
    token.setToken(null)
    navigate('/')
  },[])
  return <div>logout</div>;
};

export default Logout;
