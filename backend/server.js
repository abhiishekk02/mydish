const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
app.use(express.json());
app.use(cors()); // Allow frontend to call backend
app.use(morgan("dev"));

// Database connection
const db = mysql.createConnection({
  host: "34.136.223.174", // Public IP you provided
  user: "adminuser", // e.g., 'root' or 'adminuser'
  password: "admin123",
  database: "RecipeAppDB",
});

// API to handle Signup
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send({ message: "Please fill out all fields." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO User (Username, Email, PasswordHash) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ message: "Error creating user." });
        }
        res.send({ message: "User created successfully!" });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error." });
  }
});

// API to handle Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM User WHERE Email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0)
        return res.status(401).send({ message: "User not found" });

      const user = results[0];
      const isPasswordMatch = await bcrypt.compare(password, user.PasswordHash);

      if (!isPasswordMatch)
        return res.status(401).send({ message: "Incorrect password" });

      res.send({ message: "Login successful" });
    }
  );
});

// API to get all users
app.get("/users", (req, res) => {
  db.query("SELECT UserID, Username, Email FROM User", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Error fetching users" });
    }
    res.send(results);
  });
});

// API to get a user by ID
app.get("/users/:id", (req, res) => {
  const userId = req.params.id;

  db.query(
    "SELECT UserID, Username, Email FROM User WHERE UserID = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: "Error fetching user" });
      }

      if (results.length === 0) {
        return res.status(404).send({ message: "User not found" });
      }

      res.send(results[0]); // Return the user data
    }
  );
});

const PORT = process.env.PORT || 3000;
const HOST = "127.0.0.1"; // 👈 Bind to localhost only

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
