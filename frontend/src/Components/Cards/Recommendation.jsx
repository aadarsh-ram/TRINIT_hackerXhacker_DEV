import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


const Recommendation = ({data})=>{

    const [list,setList] = useState(["No Recommendations Right Now"])

    useEffect(()=>{
        if(data != null) setList(data)
    },[data])

    return (
    <Card sx={{
        borderRadius: "20px",
        background: "#FFFFFF"
    }}>
      <CardContent>
        <Typography variant="h5" component="div" style={{paddingBottom:"1rem"}}>
            Recommendations
        </Typography>
        <div>
            {list.map((item,i)=>{
            return <Typography key={i} variant="body2">
                {item}
            </Typography>})}
        </div>
      </CardContent>
    </Card>
  );
}
export default Recommendation;