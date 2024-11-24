import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Chip,
    Fab,
    Drawer,
    TextField,
    Button,
    Checkbox,
    IconButton,
    Toolbar,
    FormControlLabel,
    Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

function Machines() {
    const [machines, setMachines] = useState([]);
    const [selectedMachines, setSelectedMachines] = useState([]); // Máquinas seleccionadas
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [newMachine, setNewMachine] = useState({
        name: '',
        location: '',
        sensors: [],
    });
    const [isEditing, setIsEditing] = useState(false); // Modo edición

    useEffect(() => {
        fetchMachines();
    }, []);

    const fetchMachines = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch("http://localhost:3000/machines", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setMachines(data.results || []);
            }
        } catch (error) {
            console.error("Error al obtener las máquinas:", error);
        }
    };

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setNewMachine({ name: '', location: '', sensors: [] });
        setIsEditing(false); // Salir del modo edición
        setSelectedMachines([]); // Limpiar selección
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMachine((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveMachine = async () => {
        const token = localStorage.getItem('token');
        if (isEditing && selectedMachines.length === 1) {
            // Obtener el ID de la máquina seleccionada
            const machineId = selectedMachines[0]._id;
    
            try {
                const response = await fetch(`http://localhost:3000/machines/${machineId}`, {
                    method: "PUT", // Cambiar a PUT para actualizar
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newMachine),
                });
    
                if (response.ok) {
                    const updatedMachine = await response.json();
    
                    // Actualizar la máquina en la lista
                    setMachines((prev) =>
                        prev.map((machine) =>
                            machine._id === updatedMachine._id ? updatedMachine : machine
                        )
                    );
    
                    // Cerrar el drawer y limpiar los datos
                    handleDrawerClose();
                } else {
                    console.error("Error al actualizar la máquina.");
                }
            } catch (error) {
                console.error("Error al actualizar la máquina:", error);
            }
        } else {
            // Código para guardar nueva máquina
            try {
                const response = await fetch("http://localhost:3000/machines", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newMachine),
                });
    
                if (response.ok) {
                    const savedMachine = await response.json();
                    setMachines((prev) => [...prev, savedMachine]);
                    handleDrawerClose();
                } else {
                    console.error("Error al guardar la máquina.");
                }
            } catch (error) {
                console.error("Error al guardar la máquina:", error);
            }
        }
    };
    

    const handleSelectMachine = (machine) => {
        // Alternar selección de máquinas
        setSelectedMachines((prev) =>
            prev.some((selected) => selected._id === machine._id)
                ? prev.filter((selected) => selected._id !== machine._id)
                : [...prev, machine]
        );
    };

    const handleEditSelectedMachine = () => {
        if (selectedMachines.length === 1) {
            const machineToEdit = selectedMachines[0];
            setNewMachine(machineToEdit); // Cargar datos de la máquina en el formulario
            setIsEditing(true); // Entrar en modo edición
            handleDrawerOpen();
        } else {
            alert("Por favor, selecciona solo una máquina para editar.");
        }
    };

    const handleDeleteSelectedMachines = async () => {
        const token = localStorage.getItem('token');
        try {
            for (const machine of selectedMachines) {
                await fetch(`http://localhost:3000/machines/${machine._id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
            }
            setMachines((prev) =>
                prev.filter((machine) => !selectedMachines.some((selected) => selected._id === machine._id))
            );
            setSelectedMachines([]);
        } catch (error) {
            console.error("Error al eliminar las máquinas seleccionadas:", error);
        }
    };

    return (
        <Box mt={4}>
            <Toolbar>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={handleEditSelectedMachine}
                    sx={{ mr: 2 }}
                >
                    Editar
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteSelectedMachines}
                >
                    Eliminar
                </Button>
            </Toolbar>

            <Typography variant="h5" gutterBottom>
                Máquinas
            </Typography>
            <Box>
                {machines.map((machine) => (
                    <Box
                        key={machine._id}
                        sx={{
                            mb: 2,
                            border: selectedMachines.some((selected) => selected._id === machine._id)
                                ? '2px solid green'
                                : '1px solid lightgray',
                            padding: '10px',
                            borderRadius: '5px',
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedMachines.some((selected) => selected._id === machine._id)}
                                    onChange={() => handleSelectMachine(machine)}
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="h6">{machine.name}</Typography>
                                    <Typography variant="body2">Ubicación: {machine.location}</Typography>
                                </Box>
                            }
                        />
                        <Chip label={machine.status} />
                        <Divider />
                    </Box>
                ))}
            </Box>

            {/* Botón flotante para agregar/editar máquina */}
            <Fab
                color="primary"
                aria-label="add"
                onClick={handleDrawerOpen}
                style={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                }}
            >
                <AddIcon />
            </Fab>

            {/* Drawer para agregar/editar máquinas */}
            <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
                <Box sx={{ width: 400, p: 3 }}>
                    <IconButton onClick={handleDrawerClose}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6">
                        {isEditing ? "Editar Máquina" : "Nueva Máquina"}
                    </Typography>
                    <TextField
                        fullWidth
                        label="Nombre de la Máquina"
                        name="name"
                        value={newMachine.name}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Ubicación"
                        name="location"
                        value={newMachine.location}
                        onChange={handleInputChange}
                        margin="normal"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSaveMachine}
                    >
                        {isEditing ? "Editar Máquina" : "Guardar Máquina"}
                    </Button>
                </Box>
            </Drawer>
        </Box>
    );
}

export default Machines;
