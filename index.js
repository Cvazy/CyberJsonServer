const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

const dbFilePath = path.resolve(__dirname, "db.json");

app.get("/:collection", (req, res) => {
  const { collection } = req.params;
  try {
    const db = JSON.parse(fs.readFileSync(dbFilePath, "utf-8"));
    if (db[collection]) {
      return res.json(db[collection]);
    }
    return res.status(404).json({ message: "Collection not found" });
  } catch (error) {
    console.error("Error reading DB file:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  try {
    const db = JSON.parse(fs.readFileSync(dbFilePath, "utf-8"));
    const { users } = db;
    const userFromDb = users.find(
      (user) => user.username === username && user.password === password,
    );
    if (userFromDb) {
      return res.json(userFromDb);
    }
    return res.status(403).json({ message: "AUTH ERROR" });
  } catch (error) {
    console.error("Error reading DB file:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
