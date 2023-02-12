import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import styles from "./styles.module.css"
import carbon from '../../../public/Footprint.png'
import { FaLeaf } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Landing = ()=>{
    const navigate = useNavigate()
    const loggedin = (localStorage.getItem('ecotrack-token') !== null)
    const handleprofile = ()=>{
        navigate('/list',{replace:true})
    }
    const handlelogin =()=>{
        navigate('/login',{replace:true})
    }
    const handlesignup = ()=>{
        navigate('/signup',{replace:true})
    }
    const handlelogout = ()=>{
        localStorage.removeItem('ecotrack-token')
    }
    return (<>
        <img src={carbon} className={styles.carbonimg}>
        </img>
        <div className={styles.icondiv}>
            <FaLeaf color='#000000' className={styles.icon}/>
        </div>
        <div className={styles.wrapper} 
            style={{
                display:"flex",
                width:"100vw",
                alignItems:"center",
                justifyContent:"center"}}>
            <Box 
                sx={{
                    width: '57.63vw',
                    height: '100vh',
                    backgroundColor: '#ffffff',
            }}>
                <div className={styles.heading}>
                    ECO TRACK.
                </div>
                <div className={styles.desc}>
                    Track Your Carbon Footprints
                </div>
                <div className={styles.btngrp2}>
                    <Button variant='contained' color='success' className={styles.btn}
                    onClick={loggedin ? handlelogin : handleprofile}
                    >
                        {loggedin ? "PROFILE" : "LOG IN" }
                    </Button>
                    <Button variant='contained' color='success' className={styles.btn}
                    onClick={loggedin ? handlelogout : handlesignup}
                    >
                        {loggedin ? "LOG OUT" : "SIGN UP" }
                    </Button>
                </div>
            </Box>
            <Box 
                sx={{
                    width: '42.36vw',
                    height: '100vh',
                    backgroundColor: '#242424',
                    background : 'url(/forest.png)',
                    backdropFilter: 'blur(5px)'
            }}>
            </Box>
        </div>
    </>)
}

export default Landing;
