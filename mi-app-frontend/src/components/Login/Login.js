import React, { useState } from 'react';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();

                // Comprueba si `accessToken` está en la respuesta
                if (data.accessToken) {
                    const token = data.accessToken;

                    // Guarda el token en el localStorage
                    localStorage.setItem('token', token);

                    // Llama a onLogin para actualizar el estado de la app
                    onLogin(token);
                    alert("Inicio de sesión exitoso");
                } else {
                    alert("Error: No se recibió un token de acceso.");
                }
            } else {
                alert("Error al intentar iniciar sesión. Verifica tus credenciales.");
            }
        } catch (error) {
            console.error("Error en la solicitud de inicio de sesión:", error);
            alert("Error al intentar iniciar sesión.");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
