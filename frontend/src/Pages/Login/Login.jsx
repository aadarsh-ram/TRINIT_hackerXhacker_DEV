import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Navbar } from "../../Components";
import { config } from "../../config/index"
import { login,error } from "../../Components/Toast/Toast"
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const sendTokenToChromeExtension = ({ extensionId, jwt}) => {
    chrome.runtime.sendMessage(extensionId, { jwt }, response => {
      if (!response.success) {
        // console.log('error sending message', response);
        return response;
      }
    //   console.log('Sucesss ::: ', response.message)
    });
  }

const Login = ()=>{
    
    const navigate = useNavigate()
    const [userName,setUserName] = useState("");
    const [password,setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading,setIsLoading] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

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
            sendTokenToChromeExtension({extensionId:config["eID"],jwt:body['access_token']})
            navigate('/list')
            login("Logged In")
        }
        else {
            error("Please Try Again")
        }
        setIsLoading(false)

    }
    return(<div style={{height:"100vh",overflowY:"clip"}}>
        <Navbar/>{
        (isLoading) 
        ? <Loader/>
        :<div style={{background: "#DAD7CD",height:"95vh",display:"flex",flexFlow:"column",alignItems:"center",justifyContent:"center"}}>
        <h1 style={{color:"#000000"}}>Login</h1>
        <FormControl sx={{ m: 4, width: '25ch' }} variant="standard">
          <InputLabel htmlFor="standard-adornment-username">Username</InputLabel>
          <Input
            id="standard-adornment-username"
            onChange={(e)=>{setUserName(e.target.value)}}
          />
        </FormControl>

        <FormControl sx={{ m: 4, width: '25ch' }} variant="standard">
          <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
          <Input
            id="standard-adornment-confirm-password"
            type={showPassword ? 'text' : 'password'}
            onChange={(e)=>{setPassword(e.target.value)}}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

            <button style={{margin:"1rem", padding:"1rem 2rem"}} onClick={()=>submit()}>Submit</button>

            <a href="/signup">Sign Up</a>
        </div>

        } </div>);
}

export default Login;