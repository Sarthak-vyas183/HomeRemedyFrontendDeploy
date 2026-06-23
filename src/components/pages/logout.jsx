/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../Store/useAuth';
import { toast } from "react-toastify";

function logout() {
    const {LogoutUser} = useAuth()
    useEffect(()=>{
        LogoutUser();
        toast.info("You've been logged out.");
    } , [LogoutUser]);

  return <Navigate to="/login"/>
}

export default logout
