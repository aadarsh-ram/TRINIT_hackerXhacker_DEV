import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import styles from "./styles.module.css"
import { Navbar } from '../../Components';

const Landing = ()=>{
    return (<>
        <Navbar/>
        <div className={styles.wrapper} 
            style={{
                display:"flex",
                width:"100vw",
                alignItems:"center",
                justifyContent:"center"}}>
            <Box 
                sx={{
                    width: '50vw',
                    height: '100vh',
                    backgroundColor: '#808080',
            }}>
                <h1>Eco Detect</h1>
            </Box>
            <Box 
                sx={{
                    width: '50vw',
                    height: '100vh',
                    backgroundColor: '#242424',
            }}>
                <h1>Eco </h1>
            </Box>
        </div>
        {/* <div style={{
            position:"absolute",
            top:0,
            height:"100vh",
            width:"100vw",
            display:"flex",
            alignItems:"center",
            justifyContent:"center"}}>
            <div>
                <img className={styles.landingImage} style={{
                    height:"80vh",
                    aspectRatio:"auto"}} 
                    src='footprint.png'/>
            </div>
        </div> */}
    </>)
}

export default Landing;
