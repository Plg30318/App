import React, { useEffect, useState } from 'react';
import { Typography, List, ListItem, ListItemText, Box, CircularProgress } from '@mui/material';

function Inventory() {
    const [inventory, setInventory] = useState(null); // Cambiado a null para verificar la carga
    const [loading, setLoading] = useState(true); // Estado para la carga

    useEffect(() => {
        const fetchInventory = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch("http://localhost:3000/inventories", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setInventory(data.results || []);
                } else {
                    console.error("Error al obtener el inventario.");
                }
            } catch (error) {
                console.error("Hubo un error en el servidor.", error);
            } finally {
                setLoading(false); // Finaliza la carga
            }
        };
        fetchInventory();
    }, []);

    if (loading) {
        return <CircularProgress />; // Muestra un indicador de carga
    }

    return (
        <Box mt={4}>
            <Typography variant="h5">Inventario</Typography>
            {inventory && inventory.length > 0 ? (
                <List>
                    {inventory.map(item => (
                        <ListItem key={item._id}>
                            <ListItemText primary={`${item.item} - Cantidad: ${item.quantity}`} />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography>No hay datos de inventario disponibles.</Typography>
            )}
        </Box>
    );
}

export default Inventory;
