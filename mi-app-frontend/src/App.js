import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './components/Sidebar/Sidebar';
import Inventory from './components/Inventory/Inventory';
import Machines from './components/Machines/Machines';
import Cameras from './components/Cameras/Cameras';
import Settings from './components/Settings/Settings';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import ThemeContextProvider from './context/ThemeContext'; // Importar el proveedor del contexto de tema

function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogin = (accessToken) => {
        setToken(accessToken);
        localStorage.setItem('token', accessToken);
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <ThemeContextProvider>
            <Router>
                <Box sx={{ display: 'flex' }}>
                    {token && <Sidebar open={isSidebarOpen} />}
                    <Box component="main" sx={{ flexGrow: 1 }}>
                        <AppBar position="static">
                            <Toolbar>
                                {token && (
                                    <IconButton edge="start" color="inherit" onClick={toggleSidebar} sx={{ mr: 2 }}>
                                        <MenuIcon />
                                    </IconButton>
                                )}
                                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                    Gestión de Inventario y Máquinas
                                </Typography>
                                {token && (
                                    <Button color="inherit" onClick={handleLogout}>
                                        Cerrar sesión
                                    </Button>
                                )}
                            </Toolbar>
                        </AppBar>
                        <Box sx={{ p: 3 }}>
                            {!token ? (
                                <Login onLogin={handleLogin} />
                            ) : (
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/inventory" element={<Inventory />} />
                                    <Route path="/machines" element={<Machines />} />
                                    <Route path="/cameras" element={<Cameras />} />
                                    <Route path="/settings" element={<Settings />} />
                                </Routes>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Router>
        </ThemeContextProvider>
    );
}

export default App;
