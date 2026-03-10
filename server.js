const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ---------------- Supabase Connection ----------------
const SUPABASE_URL = "https://lobsavlpymsipridfwso.supabase.co"; // replace with your Supabase URL
const SUPABASE_KEY = "sb_publishable_njAUCY9pfA2NVDXVO4iGkQ_JTpjq3-S";          // replace with your anon key
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---------------- USERS ----------------
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const { data, error } = await supabase
    .from("users")
    .insert([{ username, password }]);

  if (error) return res.status(400).send(error.message);
  res.send("User created");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password", password);

  if (error) return res.status(400).send(error.message);
  if (data.length > 0) res.send({ status: "success" });
  else res.send({ status: "fail" });
});

// ---------------- TIMETABLE ----------------
app.get("/timetable", async (req, res) => {
  const { data, error } = await supabase.from("timetable").select("*");
  if (error) return res.status(400).send(error.message);
  res.send(data);
});

app.post("/timetable", async (req, res) => {
  const { time, activity } = req.body;
  const { error } = await supabase.from("timetable").insert([{ time, activity }]);
  if (error) return res.status(400).send(error.message);
  res.send("Schedule added");
});

app.put("/timetable/:id", async (req, res) => {
  const { id } = req.params;
  const { time, activity } = req.body;
  const { error } = await supabase
    .from("timetable")
    .update({ time, activity })
    .eq("id", id);
  if (error) return res.status(400).send(error.message);
  res.send("Schedule updated");
});

app.delete("/timetable/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("timetable").delete().eq("id", id);
  if (error) return res.status(400).send(error.message);
  res.send("Deleted");
});

// ---------------- JOURNAL ----------------
app.get("/journal", async (req, res) => {
  const { data, error } = await supabase.from("journal").select("*");
  if (error) return res.status(400).send(error.message);
  res.send(data);
});

app.post("/journal", async (req, res) => {
  const { content } = req.body;
  const { error } = await supabase.from("journal").insert([{ content }]);
  if (error) return res.status(400).send(error.message);
  res.send("Added");
});

app.put("/journal/:id", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const { error } = await supabase.from("journal").update({ content }).eq("id", id);
  if (error) return res.status(400).send(error.message);
  res.send("Updated");
});

app.delete("/journal/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("journal").delete().eq("id", id);
  if (error) return res.status(400).send(error.message);
  res.send("Deleted");
});

// ---------------- HABITS ----------------
app.get("/habits", async (req, res) => {
  const { data, error } = await supabase.from("habits").select("*");
  if (error) return res.status(400).send(error.message);
  res.send(data);
});

app.post("/habits", async (req, res) => {
  const { habit } = req.body;
  const { error } = await supabase.from("habits").insert([{ habit }]);
  if (error) return res.status(400).send(error.message);
  res.send("Habit added");
});

app.put("/habits/:id", async (req, res) => {
  const { id } = req.params;
  const { habit } = req.body;
  const { error } = await supabase.from("habits").update({ habit }).eq("id", id);
  if (error) return res.status(400).send(error.message);
  res.send("Habit updated");
});

app.delete("/habits/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("habits").delete().eq("id", id);
  if (error) return res.status(400).send(error.message);
  res.send("Habit deleted");
});

// ---------------- LEARNING ----------------
app.get("/learning", async (req, res) => {
  const { data, error } = await supabase.from("learning").select("*");
  if (error) return res.status(400).send(error.message);
  res.send(data);
});

app.post("/learning", async (req, res) => {
  const { topic } = req.body;
  const { error } = await supabase.from("learning").insert([{ topic }]);
  if (error) return res.status(400).send(error.message);
  res.send("Added");
});

app.put("/learning/:id", async (req, res) => {
  const { id } = req.params;
  const { topic } = req.body;
  const { error } = await supabase.from("learning").update({ topic }).eq("id", id);
  if (error) return res.status(400).send(error.message);
  res.send("Updated");
});

app.delete("/learning/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("learning").delete().eq("id", id);
  if (error) return res.status(400).send(error.message);
  res.send("Deleted");
});

// ---------------- ANALYTICS ----------------
app.get("/analytics", async (req, res) => {
  const data = {};
  const journal = await supabase.from("journal").select("*", { count: "exact" });
  const habits = await supabase.from("habits").select("*", { count: "exact" });
  const learning = await supabase.from("learning").select("*", { count: "exact" });
  data.journal = journal.count;
  data.habits = habits.count;
  data.learning = learning.count;
  res.send(data);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});