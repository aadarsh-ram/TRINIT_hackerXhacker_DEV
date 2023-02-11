import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { config } from "../config/index"

    
export const PrivateWrapper = () => {
	
	if(localStorage.getItem(config["token_name"]) != null) {
		return <Outlet />;
	}  else {
		return (<Navigate to="/login" />);
	}
};