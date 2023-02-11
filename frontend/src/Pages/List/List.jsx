import { Navbar, Cards, ProfileCard, Emission, Loader } from "../../Components";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from "react";
import { BsFillCalendarFill, BsClockFill } from "react-icons/bs"
import { useNavigate } from "react-router-dom";
import jwt from 'jwt-decode'


const arr = [
    {
        "session_id": "12346",
        "timestamp": "2011-05-19T15:36:38",
        "color": "green"
    },
    {
        "session_id": "12345",
        "timestamp": "2011-05-18T15:36:38",
        "color": "no-green"
    }
]
// const data = [
//     {
//         "session_id": "12346",
//         "timestamp": "2011-05-17T15:37:38",
//         "request_url": "googl.com",
//         "co2_renewable_grams": "10",
//         "co2_grid_grams": "20",
//         "energy_kwg": "100",
//         "category": "green"
//     },
//     {
//         "session_id": "12346",
//         "timestamp": "2011-05-17T15:38:38",
//         "request_url": "facbe.com",
//         "co2_renewable_grams": "30",
//         "co2_grid_grams": "50",
//         "energy_kwg": "200",
//         "category": "semi-green"
//     }
// ]

const color = {"green":"#00FF40","semi-green":"#90EE90","no-green":"#D0312D"}
const List = ()=>{

    const navigate = useNavigate()
    const [webItem,setWebItem] = useState(null);
    const [webCard, setWebCard] = useState(null)
    const [expanded, setExpanded] = useState(false);
    const [cardData, setCardData] = useState([{"request_url": "No Websites!",}]);
    const [sessionList, setSessionList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    

    useEffect(()=>{
        const login = localStorage.getItem("ecotrack-token")
        if(login == null) navigate("/login")
        else getSession()
    },[])

    const getSession = async()=>{
        setIsLoading(true)
        let token = jwt(localStorage.getItem("ecotrack-token"))        
        await fetch("http://localhost:8000/get-user-sessions/?"+ new URLSearchParams({
            username:token["user_id"]
        }), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async(res)=>{
            let response = await res.json()
            setSessionList(response)
        }).catch(e =>console.log(e))
        setIsLoading(false)

    }

    const handleChange = (panel) => async(event, isExpanded) => {
        if(isExpanded){
            setWebItem(panel)
            setExpanded(panel)
            await fetch("http://localhost:8000/get-session/?"+ new URLSearchParams({
                session_id:sessionList[panel]["session_id"]
            }), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(async(res)=>{
                let response = await res.json()
                console.log(response)
                setCardData(response)
            }).catch(e =>console.log(e))
        }
        else{
            setWebItem(null)
            setExpanded(false)
            setWebCard(null)
        }
    };

    const handleSiteClick = async(i) =>{        
        setWebCard(cardData[i])
    }
    
        
    useEffect(()=>{
        if(webItem!=null){
            //Fetch
            // setCardData(data)
        }
        else {
            setCardData([{"request_url": "No Websites!",}])
        }
    },[webItem])


    return (
    (isLoading)?  <Loader/> :<>
        <Navbar/>
        <section style={{height:"35vh",width:"100vw",backgroundColor: "#0093E9",
                    backgroundImage: "linearGradient(160deg, #0093E9 0%, #80D0C7 100%)"}}>
        </section>

        <section style={{background:"beige" ,height:"55vh",width:"100vw",display:"flex",justifyContent:"center",flexFlow:"row wrap"}}>
            <div style={{position:"relative",top:"-10vh",padding:"1rem",flexBasis:"20vw"}}><ProfileCard/></div>
            <div style={{position:"relative",top:"0vh",padding:"1rem",flexBasis:"50vw"}}>
                {sessionList.map((item,i)=>{
                    return (
                    <Accordion 
                        style = {{background: color[item["color"]],margin:"1rem", boxShadow: (expanded === i) ? "rgba(0, 0, 0, 0.35) 0px 5px 15px" : "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
                        expanded={expanded === i} 
                        onChange={handleChange(i)} 
                        key={i} >
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        >
                        <Typography>
                            <BsFillCalendarFill style={{marginRight:"0.2rem"}}/>
                            {item["timestamp"].split("T")[0]}
                        </Typography>
                        <Typography style={{marginLeft:"20vw"}}>
                            <BsClockFill style={{marginRight:"0.2rem"}}/>
                            {item["timestamp"].split("T")[1]}
                        </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <div>
                           {cardData.map((card,i)=>{
                            return <a key={i} onClick={()=>{handleSiteClick(i)}}><h4>{card["request_url"]}</h4></a>
                           })}
                        </div>
                        </AccordionDetails>
                    </Accordion>)
                })}
            </div>
            <div style={{position:"relative",top:"-10vh",padding:"1rem",flexBasis:"25vw"}}>
                <Emission data={webCard}/>
            </div>
        </section>
        <section>

        </section>
    </> 
    )
}

export default List;