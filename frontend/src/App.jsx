import { useEffect, useState } from "react";

const API = "/api/todos";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  async function request(url, options) {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) throw new Error((await res.json()).error || "Request failed");
    return res.json();
  }

  useEffect(() => {
    request(API).then(setTodos).catch((e) => setError(e.message));
  }, []);

  async function addTodo(e) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const todo = await request(API, {
        method: "POST",
        body: JSON.stringify({ title }),
      });
      setTodos([todo, ...todos]);
      setTitle("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleTodo(todo) {
    try {
      const updated = await request(`${API}/${todo._id}`, {
        method: "PUT",
        body: JSON.stringify({ completed: !todo.completed }),
      });
      setTodos(todos.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTodo(id) {
    try {
      await request(`${API}/${id}`, { method: "DELETE" });
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="app">
      <h1>Todo App</h1>
      <form onSubmit={addTodo}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit">Add</button>
      </form>
      {error && <p className="error">{error}</p>}
      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className={todo.completed ? "done" : ""}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo)}
              />
              <span>{todo.title}</span>
            </label>
            <button className="delete" onClick={() => deleteTodo(todo._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && <p className="empty">No todos yet.</p>}
    </main>
  );
}
