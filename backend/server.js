import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import supabase from "./supabaseClient.js"

dotenv.config()

const app = express()

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE"]
}))

app.use(express.json())

// ROOT
app.get("/", (req, res) => {
  res.send("Todo API is running 🚀")
})

// GET TODOS
app.get("/todos", async (req, res) => {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return res.status(500).json({ error })

  res.json(data)
})

// CREATE TODO
app.post("/todos", async (req, res) => {
  const { title } = req.body

  const { data, error } = await supabase
    .from("todos")
    .insert([{ title }])
    .select()

  if (error) return res.status(500).json({ error })

  res.json(data)
})

// UPDATE TODO
app.patch("/todos/:id", async (req, res) => {
  const { id } = req.params
  const { title, completed } = req.body

  let updateData = {}
  if (title !== undefined) updateData.title = title
  if (completed !== undefined) updateData.completed = completed

  const { data, error } = await supabase
    .from("todos")
    .update(updateData)
    .eq("id", id)
    .select()

  if (error) return res.status(500).json({ error })

  res.json(data)
})

// DELETE TODO
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params

  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id)

  if (error) return res.status(500).json({ error })

  res.json({ message: "Deleted successfully" })
})

// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
})