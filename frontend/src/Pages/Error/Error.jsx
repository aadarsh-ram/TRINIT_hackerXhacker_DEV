import { useNavigate } from "react-router-dom";
import { Navbar } from "../../Components";

const Error = ()=>{

    const navigate = useNavigate()
    
    return (
        <div style={{height:"100vh",overflowY:"clip"}}>
            <Navbar/> 
            <div style={{height:"80vh",display:"flex",flexFlow:"column wrap",justifyContent:"center",alignItems:"center"}}>
                <h1 style={{margin:"3rem",padding:"1rem"}}>Uh oh! Visiting this Page has cost the Earth!</h1>
                <button style={{fontSize:"1.5rem"}}onClick={()=>navigate("/login")}>Login</button>
            </div>
        </div>)
}

export default Error;