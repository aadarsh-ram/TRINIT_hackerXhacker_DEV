import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { BsFillPersonFill } from "react-icons/bs";
import jwt from 'jwt-decode'
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';


export default function ProfileCard({userStats}) {


    const [user,setUser] = useState("User Name")
    const [stats,setStats] = useState([])

    useEffect(()=>{
        setUser(jwt(localStorage.getItem("ecotrack-token"))["user_id"])
    },[])
    useEffect(()=>{
        setStats(userStats)
    },[userStats])


    const finder = (val)=>{
        return (val > 10)    
    }

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
          <div style={{display:"flex",flexFlow:"row nowrap"}}>
            { (finder(stats["user_co2_grid_grams"])) ? 
              <div><KeyboardDoubleArrowUpIcon style={{color:"#FF0000"}}/></div>
              :<div><KeyboardDoubleArrowDownIcon style={{color:"#0000FF"}}/></div>}
            <div>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Total CO2 Grid Emissions : {stats["user_co2_grid_grams"]} grams
                </Typography>
            </div>
        </div>
        <div style={{display:"flex",flexFlow:"row nowrap"}}>
            { (finder(stats["user_co2_renewable_grams"])) ? 
              <div><KeyboardDoubleArrowUpIcon style={{color:"#FF0000"}}/></div>
              :<div><KeyboardDoubleArrowDownIcon style={{color:"#0000FF"}}/></div>}
            <div>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Total CO2 Renewable Emissions : {stats["user_co2_renewable_grams"]} grams
                </Typography>
            </div>
        </div>
        <div style={{display:"flex",flexFlow:"row nowrap"}}>
            { (finder(stats["user_energy_kwg"])) ? 
              <div><KeyboardDoubleArrowUpIcon style={{color:"#FF0000"}}/></div>
              :<div><KeyboardDoubleArrowDownIcon style={{color:"#0000FF"}}/></div>}
            <div>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Total Energy in KiloWatt/Gram : {stats["user_energy_kwg"]} grams
                </Typography>
            </div>
        </div>
          <Typography variant="body2" color="text.secondary">
            
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}