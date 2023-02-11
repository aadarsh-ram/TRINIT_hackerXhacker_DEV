import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { dataFetch } from "../../utils/dataFetch";

var headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
};
const Error = ()=>{

    const navigate = useNavigate()
    
    return (
        <>
            <h1>404 Error</h1>
            <button onClick={()=>navigate("/login")}>Login</button>
        </>)
}

export default Error;