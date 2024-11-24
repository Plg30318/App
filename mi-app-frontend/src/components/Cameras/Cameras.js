import React from 'react';
import { Box, Typography } from '@mui/material';

function Cameras() {
    return (
        <Box p={3}>
            <Typography variant="h4">Cámaras</Typography>
            <Typography variant="body1" mt={2}>
                Aquí puedes monitorear las cámaras y realizar el control de acceso.
            </Typography>
        </Box>
    );
}

export default Cameras;
