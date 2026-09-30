const express = require("express");
const cors = require('cors');
const pool = require("./db");
 
const app = express();
app.use(express.json());
// Seul le frontend a le droit d'appeler l'API depuis un navigateur
app.use(cors({
origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}));
 
// GET /tasks : liste de tous les tasks
// Avant : res.json(tasks)
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
 
// GET /tasks/:id : un item précis
// Avant : tasks.find(i => i.id === id)
app.get("/tasks/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Item introuvable" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
 
// POST /tasks : création
// Avant : tasks.push(newItem)
app.post("/tasks", async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Le champ name est obligatoire" });
  try {
    const result = await pool.query(
      "INSERT INTO tasks (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
 
// PUT /tasks/:id : modification
// Avant : tasks[index] = { ...tasks[index], ...req.body }
app.put("/tasks/:id", async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      "UPDATE tasks SET name = $1, description = $2 WHERE id = $3 RETURNING *",
      [name, description, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Item introuvable" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
 
// DELETE /tasks/:id : suppression
// Avant : tasks.splice(index, 1)
app.delete("/tasks/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Item introuvable" });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
 
app.listen(3000, () => console.log("API démarrée sur le port 3000"));