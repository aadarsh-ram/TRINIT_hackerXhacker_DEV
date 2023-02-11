import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loader = ()=> {
  return (
    <Box sx={{ width:"100vw",height:"100vh",display: 'flex',justifyContent:"center",alignItems:"center" }}>
      <CircularProgress size={100}/>
    </Box>
  );
}

export default Loader;