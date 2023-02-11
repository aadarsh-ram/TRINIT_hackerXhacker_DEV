import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Navbar } from "../../Components";
import { config } from "../../config/index"
import { login,error } from "../../Components/Toast/Toast"



const SignUp = ()=>{
    
    const navigate = useNavigate();
    const [userName,setUserName] = useState("");
    const [password,setPassword] = useState("");
    const [confirm,setConfirm] = useState("");
    const [isLoading,setIsLoading] = useState(false);

    useEffect(()=>{
        const login = localStorage.getItem(config["token_name"])
        if(login != null) navigate("/list")
    },[])
    
    const submit = async()=>{
        setIsLoading(true)
        if(confirm != password) {
            alert("Passwords Dont Match!")
            setIsLoading(false)
        }
        else{
            // Fetch
            const response = await fetch(`${config["backend_url"]}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"username":userName,"password":password}),
            })
            if(response.ok){
                navigate('/login')
                login("Signed Up!")
            }
            else {
                error("Please Try Again")
            }
            setIsLoading(false)
        }
    }

    return(<>
        <Navbar/>{
        (isLoading) 
        ? <Loader/>
        :<>
            <input value={userName} placeholder="Username" onChange={(e)=>{setUserName(e.target.value)}}/>
            <input value={password} placeholder="Password" type="password" onChange={(e)=>{setPassword(e.target.value)}}/>
            <input value={confirm} placeholder="Confirm Password" type="password" onChange={(e)=>{setConfirm(e.target.value)}}/>
            <button onClick={()=>submit()}>Submit</button>
        </>} </>);
}

export default SignUp;