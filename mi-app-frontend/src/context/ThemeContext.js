import React, { createContext, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export const ThemeContext = createContext();

function ThemeContextProvider({ children }) {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: darkMode ? '#005a32' : '#4caf50', // Verde oscuro y claro
            },
            background: {
                default: darkMode ? '#1d1b1b' : '#ffffff', // Negro o blanco
            },
            text: {
                primary: darkMode ? '#ffffff' : '#000000', // Blanco o negro
            },
        },
        components: {
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: darkMode ? '#005a32' : '#4caf50', // Barra superior verde
                        color: '#ffffff', // Texto blanco siempre
                    },
                },
            },
        },
    });

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

export default ThemeContextProvider;
