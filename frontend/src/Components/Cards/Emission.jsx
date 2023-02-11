import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';



const colorSet = {"green":"#00FF40","semi-green":"#90EE90","no-green":"#D0312D"}
const colorSet2 = {"green":"#FF0000","semi-green":"#00FF00","no-green":"#0000FF"}



const Emission = ({data})=> {

    const [emissionData,setEmissionData] = useState({"session_id": "",
    "timestamp": "",
    "request_url": "Pick a Website",
    "co2_renewable_grams": "",
    "co2_grid_grams": "",
    "energy_kwg": "",
    "category": ""})
    const [color,setColor] = useState("#FFFFFF")

    useEffect(()=>{
        if(data != null) {
            setEmissionData(data)
            setColor(colorSet[data["category"]])
        } else{
            setEmissionData({"session_id": "",
            "timestamp": "",
            "request_url": "Pick a Website",
            "co2_renewable_grams": "",
            "co2_grid_grams": "",
            "energy_kwg": "",
            "category": ""})
            setColor("#FFFFFF")
        }
    },[data])

    const finder = (val)=>{
        return (val > 10)    
    }
  return (
    (emissionData["request_url"] != "Pick a Website") ?
    <Card sx={{
        minHeight:"20vh",
        marginBottom: "1rem",
        borderRadius: "20px",
        background: color,
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px"
    }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Website
        </Typography>
        <Typography variant="h5" component="div">
          {emissionData["request_url"]}
        </Typography>
        <div style={{display:"flex",flexFlow:"row nowrap"}}>
            { (finder(emissionData["co2_renewable_grams"])) ? 
              <div><KeyboardDoubleArrowUpIcon style={{color:"#FF0000"}}/></div>
              :<div><KeyboardDoubleArrowDownIcon style={{color:"#0000FF"}}/></div>}
            <div>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                CO2 Renewable Emissions : {emissionData["co2_renewable_grams"]} grams
                </Typography>
            </div>
        </div>
        <div style={{display:"flex",flexFlow:"row nowrap"}}>
          { (finder(emissionData["co2_grid_grams"])) ? 
                <div><KeyboardDoubleArrowUpIcon style={{color:"#FF0000"}}/></div>
                :<div><KeyboardDoubleArrowDownIcon style={{color:"#0000FF"}}/></div>}
            <div>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                CO2 Grid Emissions : {emissionData["co2_grid_grams"]} grams
                </Typography>
            </div>
        </div>
        <div style={{display:"flex",flexFlow:"row nowrap"}}>
          { (finder(emissionData["energy_kwg"])) ? 
                <div><KeyboardDoubleArrowUpIcon style={{color:"#FF0000"}}/></div>
                :<div><KeyboardDoubleArrowDownIcon style={{color:"#0000FF"}}/></div>}
            <div>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Energy in KiloWatt/Gram : {emissionData["energy_kwg"]}KW/g
                </Typography>
            </div>
        </div>
      </CardContent>
    </Card> :
    <Card sx={{
        minHeight:"20vh",
        marginBottom: "1rem",
        borderRadius: "20px",
        background: color,
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px"
    }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Website
        </Typography>
        <Typography variant="h5" component="div">
          {emissionData["request_url"]}
        </Typography>
      </CardContent>
    </Card>

  );
}

export default Emission;