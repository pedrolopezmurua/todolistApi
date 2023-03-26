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
    setInputValue(event.target.value);
  }

  function handleDelete(label) {
    const updatedTasks = tasks.filter((task) => task.label !== label);
    setTasks(updatedTasks);

    fetch(`https://assets.breatheco.de/apis/fake/todos/user/Pedro`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTasks.map(task => ({...task, done: true}))),
    })
      .catch((error) => console.log(error));
  }

  return (
    <div className="container">
      <h1>To Do List</h1>
      <form onSubmit={handleSubmit} className="form" autoComplete="off">
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
            <li key={`${task.label}-${task.done}`}>
              <p>{decodeURI(task.label)}</p>
              <button type="button" onClick={() => handleDelete(task.label)}>Eliminar</button>
            </li>
          ) : null
        )}
      </ul>
      <p>Total de Tareas: {tasks.filter((task) => !task.done).length}</p>
    </div>
  );
}

export default Home;