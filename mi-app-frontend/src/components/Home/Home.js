import React from 'react';
import { Box, Typography } from '@mui/material';

function Home() {
    return (
        <Box p={3}>
            <Typography variant="h4">Inicio</Typography>
            <Typography variant="body1" mt={2}>
                Bienvenido al panel de Inicio.
            </Typography>
        </Box>
    );
}

export default Home;
