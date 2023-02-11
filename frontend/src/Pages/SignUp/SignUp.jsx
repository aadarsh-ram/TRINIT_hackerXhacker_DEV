import { useState } from "react";
import { Loader, Navbar } from "../../Components";

const SignUp = ()=>{
    
    const [userName,setUserName] = useState("");
    const [password,setPassword] = useState("");
    const [confirm,setConfirm] = useState("");
    const [isLoading,setIsLoading] = useState(false);
    
    const submit = ()=>{
        setIsLoading(true)
        if(confirm != password) alert("Passwords Dont Match!")
        console.log(userName,password)
        // Fetch
    }
    return(<>
        <Navbar/>
        (isLoading) 
        ? <Loader/>
        :<>
            <input value={userName} placeholder="Username" onChange={(e)=>{setUserName(e.target.value)}}/>
            <input value={password} placeholder="Password" onChange={(e)=>{setPassword(e.target.value)}}/>
            <input value={confirm} placeholder="Confirm Password" onChange={(e)=>{setConfirm(e.target.value)}}/>
            <button onClick={()=>submit()}>Submit</button>
        </> </>);
}

export default SignUp;