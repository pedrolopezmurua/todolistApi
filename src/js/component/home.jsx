import React, { useState, useEffect } from "react";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetch("https://assets.breatheco.de/apis/fake/todos/user/Pedro")
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.log(error));
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    if (inputValue !== "") {
      const newTask = {
        id: Date.now(),
        label: encodeURI(inputValue),
        done: false,
      };
      setTasks([...tasks, newTask]); 

      fetch("https://assets.breatheco.de/apis/fake/todos/user/Pedro", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([...tasks, newTask]),
      })
        .then(() => {
          setInputValue("");
        })
        .catch((error) => console.log(error));
    }
  }

  function handleChange(event) {
    setInputValue(escape(event.target.value));
  }

  function handleDelete(id) {
    const taskToDelete = tasks.find((task) => task.id === id);
    if (taskToDelete.done) {
      fetch(`https://assets.breatheco.de/apis/fake/todos/user/Pedro`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tasks.filter((task) => task.id !== id)),
      })
        .then(() => setTasks(tasks.filter((task) => task.id !== id)))
        .catch((error) => console.log(error));
    } else {
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, done: true } : task
      );
      setTasks(updatedTasks);
      fetch(`https://assets.breatheco.de/apis/fake/todos/user/Pedro`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTasks),
      }).catch((error) => console.log(error));
    }
  }

  return (
    <div className="container">
      <h1>To Do List</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Ingrese una nueva tarea..."
          value={inputValue}
          onChange={handleChange}
        />
        <button type="submit">Agregar</button>
      </form>
      <ul>
        {tasks.map((task) =>
          !task.done ? (
            <li key={task.id}>
              <p>{task.label}</p>
              <button onClick={() => handleDelete(task.id)}>Eliminar</button>
            </li>
          ) : null
        )}
      </ul>
      <p>Total de Tareas: {tasks.filter((task) => !task.done).length}</p>
    </div>
  );
}

export default Home;