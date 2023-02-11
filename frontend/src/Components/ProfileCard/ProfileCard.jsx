import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { BsFillPersonFill } from "react-icons/bs";

const user = {"name":"YoMama"}
export default function ProfileCard() {

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <div style={{ display:'flex', justifyContent:'center' }}>
            <BsFillPersonFill size={200}/>
        </div>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {user["name"]}
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