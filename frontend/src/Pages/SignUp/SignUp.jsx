import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Navbar } from "../../Components";

const SignUp = ()=>{
    
    const navigate = useNavigate();
    const [userName,setUserName] = useState("");
    const [password,setPassword] = useState("");
    const [confirm,setConfirm] = useState("");
    const [isLoading,setIsLoading] = useState(false);

    useEffect(()=>{
        const login = localStorage.getItem("ecotrack-token")
        if(login != null) navigate("/list")
    },[])
    
    const submit = async()=>{
        setIsLoading(true)
        if(confirm != password) alert("Passwords Dont Match!")
        else{
            // Fetch
            await fetch("http://localhost:8000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"username":userName,"password":password}),
            }).then((res)=>{
                setIsLoading(false)
                navigate("/login")

            }).catch(e =>console.log(e))
        }
    }

    return(<>
        <Navbar/>
        (isLoading) 
        ? <Loader/>
        :<>
            <input value={userName} placeholder="Username" onChange={(e)=>{setUserName(e.target.value)}}/>
            <input value={password} placeholder="Password" type="password" onChange={(e)=>{setPassword(e.target.value)}}/>
            <input value={confirm} placeholder="Confirm Password" type="password" onChange={(e)=>{setConfirm(e.target.value)}}/>
            <button onClick={()=>submit()}>Submit</button>
        </> </>);
}

export default SignUp;