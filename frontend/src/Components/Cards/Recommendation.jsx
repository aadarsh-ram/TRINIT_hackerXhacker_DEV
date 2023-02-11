import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';


const color = {"green":"#00FF40","semi-green":"#90EE90","no-green":"#D0312D"}

const Recommendation = ({data,loading})=>{

    const [list,setList] = useState(["No Recommendations Right Now"])
    const [isLoading,setIsLoading] = useState(loading)
    useEffect(()=>{
        if(data != null) setList(data)
    },[data])

    useEffect(()=>{
        setIsLoading(loading)
    },[loading])

    return (
    <Card sx={{
        borderRadius: "20px",
        background: "#FFFFFF",
        minHeight:"20vh",
    }}>
      <CardContent style={{display:"flex"}}>
        {(isLoading) ? <div><CircularProgress size={50}/></div> :
        <div>
            <Typography variant="h5" component="div" style={{paddingBottom:"1rem"}}>
                Recommendations
            </Typography>
            {list.map((item,i)=>{
            return <a key={i} 
                        style={{color: color[item["category"]]}}
                        href={"https://"+item["request_url"]}>
                        <Typography  variant="body2">
                            {item["request_url"]}
                        </Typography>
                    </a>})}
        </div>}
      </CardContent>
    </Card>
  );
}
export default Recommendation;