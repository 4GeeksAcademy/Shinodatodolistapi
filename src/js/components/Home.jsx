import React, { useEffect, useState } from "react";


async function crearUsuario() {
    try {
        const res = await fetch('https://playground.4geeks.com/todo/users/Thaner', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Thaner' })
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.log('Error al crear usuario ==> ', error);
    }
}

// Función para eliminar un usuario
async function eliminarUsuario() {
    try {
        const res = await fetch("https://playground.4geeks.com/todo/users/Thaner", {
            method: 'DELETE'
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.log('Error al eliminar usuario ==> ', error);
    }
}

// Función para leer un usuario
async function leerUsuario() {
    try {
        const resultado = await fetch('https://playground.4geeks.com/todo/users/Thaner');
        const data = await resultado.json();
        return data;
    } catch (error) {
        console.log('Error ==> ', error);
        return null;
    }
}

// Componente principal
const Home = () => {
    const [newEntry, setNewEntry] = useState('');
    const [toDoList, setToDoList] = useState([]);
    const [hoverIndex, setHoverIndex] = useState(null);

    const conteo = toDoList.length;

    async function onSubmit(e) {
        e.preventDefault();
        if (newEntry.trim() === '') return;
        await crearToDo(newEntry);
        setNewEntry('');
    }

    async function eliminarElemento(index) {
        const item = toDoList[index];
        await eliminarToDo(item.id);
        const result = toDoList.filter((_, i) => i !== index);
        setToDoList(result);
    }

    async function crearToDo(item) {
        try {
            const res = await fetch('https://playground.4geeks.com/todo/todos/Thaner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ label: item, is_done: false })
            });
            const data = await res.json();
            const nuevaLista = [...toDoList, { id: data.id, label: item }];
            setToDoList(nuevaLista);
        } catch (error) {
            console.log('Error al crear ToDo ==> ', error);
        }
    }

    async function eliminarToDo(id) {
        try {
            await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.log('Error ==> ', error);
        }
    }

    async function clearToDoList() {
        try {
            await Promise.all(toDoList.map(item => eliminarToDo(item.id)));
            setToDoList([]);
            await eliminarUsuario();
        } catch (error) {
            console.log("Error al limpiar la lista ==> ", error);
        }
    }

    async function fetchData() {
        const data = await leerUsuario();
        if (data && Array.isArray(data.todos)) {
            setToDoList(data.todos);
        } else {
            await crearUsuario();
            const nuevaLista = await leerUsuario();
            if (nuevaLista && Array.isArray(nuevaLista.todos)) {
                setToDoList(nuevaLista.todos);
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="container py-5 d-flex justify-content-center align-items-start" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
            <div className="bg-warning-subtle shadow rounded p-4 w-100" style={{ maxWidth: "600px" }}>
                <h2 className="text-center mb-4">To Do List con Fetch</h2>
                <form onSubmit={onSubmit} className="mb-3">
                    <input
                        type="text"
                        className="form-control border-0 border-bottom border-dark bg-transparent"
                        placeholder="Escribe una nueva tarea..."
                        value={newEntry}
                        onChange={(e) => setNewEntry(e.target.value)}
                    />
                </form>
                <ul className="list-group list-group-flush mb-3">
                    {toDoList.length === 0 ? (
                        <li className="list-group-item bg-transparent text-center text-muted">
                            No hay tareas aún.
                        </li>
                    ) : (
                        toDoList.map((item, index) => (
                            <li
                                key={item.id}
                                className="list-group-item bg-transparent d-flex justify-content-between align-items-center border-bottom"
                                onMouseEnter={() => setHoverIndex(index)}
                                onMouseLeave={() => setHoverIndex(null)}
                            >
                                <span>{item.label}</span>
                                {hoverIndex === index && (
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarElemento(index)}>
                                        x
                                    </button>
                                )}
                            </li>
                        ))
                    )}
                </ul>
                <div className="d-flex justify-content-between align-items-center border-top pt-2">
                    <small className="text-muted">Task pending: {conteo}</small>
                    <button className="btn btn-sm btn-outline-secondary" onClick={clearToDoList}>
                      Clean 
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;