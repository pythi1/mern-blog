import React from 'react';
import {useSelector} from "react-redux";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

function PrivateAdminRoute() {

    const { currentuser } = useSelector((state) => state.user);
    // const navigate = useNavigate();
    
  return currentuser && currentuser.isAdmin ? <Outlet /> : <Navigate to="/signin"/>
}

export default PrivateAdminRoute;