import { Navigate, Outlet } from "react-router-dom";

interface IUserAuth {
    isUserAuth : boolean;
}

const UserAuth = ({isUserAuth}:IUserAuth) => {
  return (
    <>
        {isUserAuth?<Outlet />:<Navigate to ="/login"/>}
    </>
  )
};

export default UserAuth;
