import { Navbar, Cards, ProfileCard } from "../../Components";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from "react";
import { BsFillCalendarFill, BsClockFill } from "react-icons/bs"


const arr = [
    {
        "session_id": "12346",
        "timestamp": "2011-05-19T15:36:38"
    },
    {
        "session_id": "12345",
        "timestamp": "2011-05-18T15:36:38"
    }
]
const data = [
    {
        "session_id": "12346",
        "timestamp": "2011-05-17T15:37:38",
        "request_url": "googl.com",
        "co2_renewable_grams": "10",
        "co2_grid_grams": "20",
        "energy_kwg": "100",
        "category": "green"
    },
    {
        "session_id": "12346",
        "timestamp": "2011-05-17T15:38:38",
        "request_url": "facbe.com",
        "co2_renewable_grams": "30",
        "co2_grid_grams": "50",
        "energy_kwg": "200",
        "category": "semi-green"
    }
]
const List = ()=>{

    const [webItem,setWebItem] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [cardData, setCardData] = useState([{"request_url": "No Websites!",}]);
    const [sessionList, setSessionList] = useState([])
    

    const handleChange = (panel) => (event, isExpanded) => {
        if(isExpanded){
            setWebItem(panel)
            setExpanded(panel)
        }
        else{
            setWebItem(null)
            setExpanded(false)
        }
    };

    useEffect(()=>{
        setSessionList(arr)
    })
    
    useEffect(()=>{
        if(webItem!=null){
            //Fetch
            setCardData(data)
        }
        else {
            setCardData([{"request_url": "No Websites!",}])
        }
    },[webItem])


    return (
    <>
        <Navbar/>
        <section style={{height:"35vh",width:"100vw",backgroundColor: "#0093E9",
                    backgroundImage: "linearGradient(160deg, #0093E9 0%, #80D0C7 100%)"}}>
        </section>

        <section style={{height:"55vh",width:"100vw",display:"flex",justifyContent:"center",flexFlow:"row wrap"}}>
            <div style={{position:"relative",top:"-10vh",padding:"1rem",flexBasis:"20vw"}}><ProfileCard/></div>
            <div style={{position:"relative",top:"0vh",padding:"1rem",flexBasis:"60vw"}}>
                {sessionList.map((item,i)=>{
                    return (
                    <Accordion expanded={expanded === i} onChange={handleChange(i)} key={i} >
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        >
                        <Typography>
                            <BsFillCalendarFill style={{marginRight:"0.2rem"}}/>
                            {item["timestamp"].split("T")[0]}
                        </Typography>
                        <Typography style={{marginLeft:"40vw"}}>
                            <BsClockFill style={{marginRight:"0.2rem"}}/>
                            {item["timestamp"].split("T")[1]}
                        </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Typography>
                           {cardData.map((card,i)=>{
                            return <span key={i}>{card["request_url"]}</span>
                           })}
                        </Typography>
                        </AccordionDetails>
                    </Accordion>)
                })}
            </div>
            <div style={{position:"relative",top:"-10vh",padding:"1rem",flexBasis:"20vw"}}><Cards/></div>
        </section>
        <section>

        </section>
    </>
    )
}

export default List;