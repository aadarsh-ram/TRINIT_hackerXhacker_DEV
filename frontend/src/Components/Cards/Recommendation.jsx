import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';


const colorSet = {"green":"#BCE29E","semi-green":"#E5EBB2","no-green":"#FF8787"}



const Recommendation = ({data,loading})=>{

    const [list,setList] = useState(["No Recommendations Right Now"])
    const [isLoading,setIsLoading] = useState(loading)
    useEffect(()=>{
        if(data != null) setList(data)
    },[data])

    useEffect(()=>{
        setIsLoading(loading)
    },[loading])

    return ((isLoading) ? 
        <Card sx={{
            borderRadius: "20px",
            background: "#111d13",
            minHeight:"20vh",
            display:"flex",
            justifyContent:"center",
            alignItems: "center",
            boxShadow: "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px"
        }}>
            <CircularProgress size={50}/>
        </Card> :
    <Card sx={{
        borderRadius: "20px",
        background: "#111d13",
        minHeight:"20vh",
        boxShadow: "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px"
    }}>
      <CardContent style={{display:"flex"}}>
        <div style={{padding:"1rem"}}>
            <Typography variant="h5" component="div" style={{color:"#70e000",paddingBottom:"1rem"}}>
                Recommendations
            </Typography>
            {list.map((item,i)=>{
            return <a key={i} 
                        style={{color: colorSet[item["category"]]}}
                        href={"https://"+item["request_url"]}>
                        <Typography  variant="body2">
                            {item["request_url"]}
                        </Typography>
                    </a>})}
        </div>
      </CardContent>
    </Card>
  );
}
export default Recommendation;