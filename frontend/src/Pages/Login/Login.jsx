import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Navbar } from "../../Components";

const Login = ()=>{
    
    const navigate = useNavigate()
    const [userName,setUserName] = useState("");
    const [password,setPassword] = useState("");
    const [isLoading,setIsLoading] = useState(false);

    useEffect(()=>{
        const login = localStorage.getItem("ecotrack-token")
        if(login != null) navigate("/list")
    },[])
    
    const submit = async()=>{
        setIsLoading(true)
        // Fetch
        await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"username":userName,"password":password}),
        }).then(async(res)=>{
            let response = await res.json()
            console.log(response)
            localStorage.setItem("ecotrack-token",response['access_token'])
            setIsLoading(false)
            navigate('/list')
        }).catch(e =>console.log(e))
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