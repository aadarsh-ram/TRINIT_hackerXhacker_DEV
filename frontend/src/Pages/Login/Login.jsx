import { useState } from "react";
import { Loader, Navbar } from "../../Components";

const Login = ()=>{
    
    const [userName,setUserName] = useState("");
    const [password,setPassword] = useState("");
    const [isLoading,setIsLoading] = useState(false);
    
    const submit = ()=>{
        setIsLoading(true)
        console.log(userName,password)
        // Fetch
    }
    return(
        (isLoading) 
        ? <Loader/>
        :<>
            <Navbar/>
            <input value={userName} placeholder="Username" onChange={(e)=>{setUserName(e.target.value)}}/>
            <input value={password} placeholder="Password" onChange={(e)=>{setPassword(e.target.value)}}/>
            <button onClick={()=>submit()}>Submit</button>
        </>);
}

export default Login;