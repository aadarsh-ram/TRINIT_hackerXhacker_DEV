import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { BsFillPersonFill } from "react-icons/bs";
import jwt from 'jwt-decode'


const user = {"name":"YoMama"}
export default function ProfileCard() {


    const [user,setUser] = useState("User Name")

    useEffect(()=>{
        setUser(jwt(localStorage.getItem("ecotrack-token"))["user_id"])
    },[])
  return (
    <Card sx={{
        borderRadius : "20px",
        boxShadow: "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px"
    }}>
      <CardActionArea>
        <div style={{ display:'flex', justifyContent:'center' }}>
            <BsFillPersonFill size={200}/>
        </div>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {user}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}