import React from "react";
import { Outlet, Navigate } from "react-router-dom";
    
export const PrivateWrapper = () => {
	
	if(localStorage.getItem("ecotrack-token") != null) {
		return <Outlet />;
	}  else {
		return (<Navigate to="/login" />);
	}
};