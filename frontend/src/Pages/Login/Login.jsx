import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Navbar } from "../../Components";
import { config } from "../../config/index"
import { login,error } from "../../Components/Toast/Toast"


const Login = ()=>{
    
    const navigate = useNavigate()
    const [userName,setUserName] = useState("");
    const [password,setPassword] = useState("");
    const [isLoading,setIsLoading] = useState(false);

    useEffect(()=>{
        const login = localStorage.getItem(config["token_name"])
        if(login != null) navigate("/list")
    },[])
    
    const submit = async()=>{
        setIsLoading(true)
        // Fetch
        const response = await fetch(`${config["backend_url"]}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"username":userName,"password":password}),
        })
        if(response.ok){
            let body = await response.json()
            localStorage.setItem(config["token_name"],body['access_token'])
            // try{
            //     chrome.runtime.sendMessage({
            //         message: "token_submission",
            //         url:response['access_token']
            //     });
            // }
            // catch(e){
            //     console.log("error",e)
            // }
            navigate('/list')
            login("Logged In")
        }
        else {
            error("Please Try Again")
        }
        setIsLoading(false)

    }
    return(
        (isLoading) 
        ? <Loader/>
        :<>
            <Navbar/>
            <input value={userName} placeholder="Username" onChange={(e)=>{setUserName(e.target.value)}}/>
            <input value={password} type="password" placeholder="Password" onChange={(e)=>{setPassword(e.target.value)}}/>
            <button onClick={()=>submit()}>Submit</button>
        </>);
}

export default Login;