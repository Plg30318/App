import React, { useContext } from 'react';
import { Box, Typography, Switch, FormControlLabel } from '@mui/material';
import { ThemeContext } from '../../context/ThemeContext'; // Importar el contexto de tema

function Settings() {
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Configuración
            </Typography>
            <Box sx={{ mt: 2 }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={darkMode}
                            onChange={toggleDarkMode}
                            color="primary"
                        />
                    }
                    label="Modo Noche"
                />
            </Box>
        </Box>
    );
}

export default Settings;
