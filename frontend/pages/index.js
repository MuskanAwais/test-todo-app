import { useEffect, useState } from "react"
import axios from "axios"

export default function Home() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState("")

  const API = "http://localhost:5000"

  // Fetch todos
  const fetchTodos = async () => {
    const res = await axios.get(`${API}/todos`)
    setTodos(res.data)
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  // Add todo
  const addTodo = async () => {
    if (!title) return

    await axios.post(`${API}/todos`, { title })
    setTitle("")
    fetchTodos()
  }

  // Toggle complete
  const toggleTodo = async (todo) => {
    await axios.patch(`${API}/todos/${todo.id}`, {
      completed: !todo.completed
    })
    fetchTodos()
  }

  // Delete
  const deleteTodo = async (id) => {
    await axios.delete(`${API}/todos/${id}`)
    fetchTodos()
  }

  // ✏️ EDIT TODO
  const editTodo = async (todo) => {
    const newTitle = prompt("Enter new title:", todo.title)

    if (!newTitle) return

    await axios.patch(`${API}/todos/${todo.id}`, {
      title: newTitle
    })

    fetchTodos()
  }

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "auto" }}>
      <h1>Minimal Todo App</h1>

      {/* Input */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter todo..."
        style={{ padding: "10px", width: "70%" }}
      />

      <button onClick={addTodo} style={{ padding: "10px", marginLeft: "10px" }}>
        Add
      </button>

      {/* Todo List */}
      <ul style={{ marginTop: "20px" }}>
      {todos.map((todo) => (
  <li key={todo.id} style={{ marginBottom: "10px" }}>

    {/* TITLE */}
    <span
      style={{
        textDecoration: todo.completed ? "line-through" : "none",
        marginRight: "10px"
      }}
    >
      {todo.title}
    </span>

    {/* ✅ COMPLETE BUTTON */}
    <button
      onClick={() => toggleTodo(todo)}
      style={{
        marginRight: "10px",
        backgroundColor: todo.completed ? "green" : "gray",
        color: "white",
        padding: "5px"
      }}
    >
      {todo.completed ? "Completed ✔️" : "Mark Complete"}
    </button>

    {/* ✏️ EDIT */}
    <button
      onClick={() => editTodo(todo)}
      style={{ marginRight: "10px" }}
    >
      ✏️
    </button>

    {/* DELETE */}
    <button onClick={() => deleteTodo(todo.id)}>
      ❌
    </button>

  </li>
))}
      </ul>
    </div>
  )
}