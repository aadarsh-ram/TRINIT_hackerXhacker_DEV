import { Navbar, Cards, ProfileCard, Emission, Loader, Recommendation } from "../../Components";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from "react";
import { BsFillCalendarFill, BsClockFill } from "react-icons/bs"
import { useNavigate } from "react-router-dom";
import jwt from 'jwt-decode'
import { config } from "../../config/index"


const colorSet = {"green":"#BCE29E","semi-green":"#E5EBB2","no-green":"#FF8787"}

const List = ()=>{

    const navigate = useNavigate()
    const [webCard, setWebCard] = useState(null)
    const [expanded, setExpanded] = useState(false);
    const [cardData, setCardData] = useState([{"request_url": "No Websites!",}]);
    const [recom, setRecom] = useState([]);
    const [isRecomLoading, setIsRecomLoading] = useState(false)
    const [sessionList, setSessionList] = useState([])
    const [userStats,setUserStats] = useState({"user_co2_renewable_grams": 0, "user_co2_grid_grams": 0, "user_energy_kwg": 0});
    const [isLoading, setIsLoading] = useState(false)
    const [empty,setEmpty] = useState(true)
    

    useEffect(()=>{
        const login = localStorage.getItem(config["token_name"])
        if(login == null) navigate("/login")
        else {
            getSession()
            getUserStats()
        }
    },[])

    const getUserStats = async()=>{
        setIsLoading(true)
        let token = jwt(localStorage.getItem(config["token_name"]))    
        await fetch( `${config["backend_url"]}/user/get-user-stats/?`+ new URLSearchParams({
            username:token["user_id"]
        }), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
    			"Authorization": `Bearer ${localStorage.getItem(config["token_name"])}`,
            },
        }).then(async(res)=>{
            let response = await res.json()
            setUserStats(response)
        }).catch(e =>console.log(e))
        setIsLoading(false)
    }

    const getSession = async()=>{
        setIsLoading(true)
        let token = jwt(localStorage.getItem(config["token_name"]))        
        await fetch( `${config["backend_url"]}/user/get-user-sessions/?`+ new URLSearchParams({
            username:token["user_id"]
        }), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
    			"Authorization": `Bearer ${localStorage.getItem(config["token_name"])}`,
            },
        }).then(async(res)=>{
            let response = await res.json()
            if(response.length != 0) setEmpty(false)
            setSessionList(response)
        }).catch(e =>console.log(e))
        setIsLoading(false)
    }

    const handleChange = (panel) => async(event, isExpanded) => {
        if(isExpanded){
            setExpanded(panel)
            await fetch( `${config["backend_url"]}/user/get-session/?`+ new URLSearchParams({
                session_id:sessionList[panel]["session_id"]
            }), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
			        "Authorization": `Bearer ${localStorage.getItem(config["token_name"])}`,
                },
            }).then(async(res)=>{
                let response = await res.json()
                setCardData(response)
            }).catch(e =>console.log(e))
        }
        else{
            setExpanded(false)
            setWebCard(null)
            setRecom([])
        }
    };

    const handleSiteClick = async(i) =>{
        setWebCard(cardData[i])
        setIsRecomLoading(true)
        await fetch(`${config["backend_url"]}/get-recommendations/?`+ new URLSearchParams({
                url:cardData[i]["request_url"]
            }), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(async(res)=>{
                let response = await res.json()
                setRecom(response)
            }).catch(e =>console.log(e)) 
        setIsRecomLoading(false)       
    }
    
    const bgImage = ()=>{
        if(userStats["user_co2_grid_grams"]+ userStats["user_co2_renewable_grams"] < 10) return "/lightGreen"
        else if(userStats["user_co2_grid_grams"]+ userStats["user_co2_renewable_grams"] < 40) return "/semiGreen"
        else return "/red"
    }
    return (
    (isLoading)?  <Loader/> :<>
        <Navbar/>
        <section style={{height:"35vh",width:"100%",overflow:"clip"}}
        // backgroundColor: "#0093E9", backgroundImage: "linearGradient(160deg, #0093E9 0%, #80D0C7 100%)"}}
        >
            <img style={{height:"35vh",width:"100%"}} src={bgImage()+".jpg"} />
        </section>

        <section style={{background:"#DAD7CD" ,height:"100vh",width:"100vw",display:"flex",justifyContent:"center",flexFlow:"row wrap"}}>
            <div style={{position:"relative",top:"-10vh",padding:"1rem",flexBasis:"20vw"}}><ProfileCard userStats={userStats}/></div>
            <div style={{position:"relative",top:"0vh",padding:"1rem",flexBasis:"50vw",height:"40vh",overflowY:"auto"}}>
                {(!empty) ? <></>: <Accordion 
                        style = {{margin:"1rem", padding:"0.3rem", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", borderRadius:"20px" }}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        >
                        <h2>No Network Requests Yet!</h2>
                        </AccordionSummary>
                    </Accordion> }
                {sessionList.map((item,i)=>{
                    return (
                    <Accordion 
                        style = {{background: colorSet[item["green_category"]],margin:"1rem", padding:"0.3rem", boxShadow: (expanded === i) ? "rgba(0, 0, 0, 0.35) 0px 5px 15px" : "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", borderRadius:"20px" }}
                        expanded={expanded === i} 
                        onChange={handleChange(i)} 
                        key={i} >
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        >
                        <Typography>
                            <BsFillCalendarFill style={{marginRight:"0.6rem"}}/>
                            {item["timestamp"].split("T")[0]}
                        </Typography>
                        <Typography style={{marginLeft:"20vw"}}>
                            <BsClockFill style={{marginRight:"0.6rem"}}/>
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
            <div style={{position:"relative",top:"-20vh",padding:"1rem",flexBasis:"25vw"}}>
                <Emission data={webCard}/>
                <Recommendation data={recom} loading={isRecomLoading}/>
            </div>
        </section>
        <section>

        </section>
    </> 
    )
}

export default List;