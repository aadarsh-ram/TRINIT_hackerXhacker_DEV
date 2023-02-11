import { useNavigate } from "react-router-dom";

const Error = ()=>{

    const navigate = useNavigate()
    return (
        <>
            <h1>404 Error</h1>
            <button onClick={()=>navigate("/login")}>Login</button>
        </>)
}

export default Error;