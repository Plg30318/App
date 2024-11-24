import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Divider } from '@mui/material';
import { Home, Inventory, Build, CameraAlt, Settings } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 240;

function Sidebar({ open }) {
    const theme = useTheme(); // Obtener el tema actual (claro u oscuro)

    const items = [
        { text: 'Inicio', icon: <Home />, path: '/' },
        { text: 'Inventario', icon: <Inventory />, path: '/inventory' },
        { text: 'Máquinas', icon: <Build />, path: '/machines' },
        { text: 'Cámaras', icon: <CameraAlt />, path: '/cameras' },
        { text: 'Configuración', icon: <Settings />, path: '/settings' },
    ];

    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={open}
            sx={{
                width: open ? drawerWidth : 60,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: open ? drawerWidth : 60,
                    boxSizing: 'border-box',
                    backgroundColor: theme.palette.primary.main, // Cambia según el tema
                    color: theme.palette.primary.contrastText, // Color de texto adecuado
                },
            }}
        >
            <Toolbar>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: theme.palette.primary.contrastText }}>
                    Mi Aplicación
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {items.map((item, index) => (
                    <ListItem
                        key={index}
                        component={Link}
                        to={item.path}
                        button // Declarar "button" sin un valor explícito
                        sx={{ color: theme.palette.primary.contrastText }}
                    >
                        <ListItemIcon sx={{ color: theme.palette.primary.contrastText }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}

export default Sidebar;
