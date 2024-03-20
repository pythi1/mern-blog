import React from 'react';
import {useSelector} from "react-redux";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

function PrivateRoute() {

    const { currentuser } = useSelector((state) => state.user);
    // const navigate = useNavigate();
    
  return currentuser ? <Outlet /> : <Navigate to="/signin"/>
}

export default PrivateRoute;