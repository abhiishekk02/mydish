const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
app.use(express.json());
app.use(cors());
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

      res.send({
        message: "Login successful",
        user: {
          UserID: user.UserID,
          Username: user.Username,
          Email: user.Email,
        },
      });
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

app.post("/add-recipe", (req, res) => {
  const {
    recipeName,
    description,
    ingredients,
    prepTime,
    cookTime,
    servings,
    imageUrl,
    cuisine, // ✅ new field
    userId,
  } = req.body;

  if (
    !recipeName ||
    !description ||
    !ingredients ||
    !prepTime ||
    !cookTime ||
    !servings ||
    !imageUrl ||
    !cuisine ||
    !userId
  ) {
    return res.status(400).send({ message: "All fields are required." });
  }

  const insertRecipeQuery = `
    INSERT INTO Recipe (Name, Description, PrepTime, CookTime, Servings, ImageURL, Cuisine, UserID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    insertRecipeQuery,
    [
      recipeName,
      description,
      prepTime,
      cookTime,
      servings,
      imageUrl,
      cuisine,
      userId,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: "Error adding recipe." });
      }

      const recipeId = result.insertId;

      const ingredientNames = ingredients.split(",").map((item) => item.trim());
      if (ingredientNames.length === 0) {
        return res.send({
          message: "Recipe added successfully without ingredients.",
        });
      }

      ingredientNames.forEach((ingredientName) => {
        if (!ingredientName) return;

        const checkIngredientQuery =
          "SELECT IngredientID FROM Ingredient WHERE Name = ?";
        db.query(
          checkIngredientQuery,
          [ingredientName],
          (checkErr, checkResults) => {
            if (checkErr) return console.error(checkErr);

            if (checkResults.length > 0) {
              const ingredientId = checkResults[0].IngredientID;
              linkIngredientToRecipe(recipeId, ingredientId);
            } else {
              const insertIngredientQuery =
                "INSERT INTO Ingredient (Name) VALUES (?)";
              db.query(
                insertIngredientQuery,
                [ingredientName],
                (insertErr, insertResult) => {
                  if (insertErr) return console.error(insertErr);
                  const newIngredientId = insertResult.insertId;
                  linkIngredientToRecipe(recipeId, newIngredientId);
                }
              );
            }
          }
        );
      });

      res.send({ message: "Recipe and ingredients added successfully!" });
    }
  );

  function linkIngredientToRecipe(recipeId, ingredientId) {
    const linkQuery = `
      INSERT INTO RecipeIngredient (RecipeID, IngredientID, Quantity, Unit)
      VALUES (?, ?, 1, 'unit') 
    `;
    db.query(linkQuery, [recipeId, ingredientId], (linkErr) => {
      if (linkErr) console.error(linkErr);
    });
  }
});
app.get("/recipes/user/:userId", (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT RecipeID, Name, Description, PrepTime, CookTime, Servings, ImageURL, Cuisine
    FROM Recipe
    WHERE UserID = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user's recipes:", err);
      return res.status(500).send({ message: "Error fetching recipes." });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .send({ message: "No recipes found for this user." });
    }

    res.status(200).json(results);
  });
});

// API to get all recipes
app.get("/recipes", (req, res) => {
  const { cuisine } = req.query;

  let query = "SELECT * FROM Recipe";
  const queryParams = [];

  if (cuisine) {
    query += " WHERE Cuisine = ?";
    queryParams.push(cuisine);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching recipes:", err);
      return res.status(500).send({ message: "Error fetching recipes" });
    }
    res.status(200).json(results);
  });
});

app.get("/recipe/:id", (req, res) => {
  const recipeId = req.params.id;
  const query = `
    SELECT r.*, u.Username 
    FROM Recipe r
    JOIN User u ON r.UserID = u.UserID
    WHERE r.RecipeID = ?
  `;

  db.query(query, [recipeId], (err, results) => {
    if (err) return res.status(500).send({ message: "Error fetching recipe" });
    if (results.length === 0)
      return res.status(404).send({ message: "Recipe not found" });

    const recipe = results[0];

    // Now get ingredients
    const ingQuery = `
      SELECT i.Name FROM RecipeIngredient ri
      JOIN Ingredient i ON ri.IngredientID = i.IngredientID
      WHERE ri.RecipeID = ?
    `;
    db.query(ingQuery, [recipeId], (err2, ingResults) => {
      if (err2)
        return res.status(500).send({ message: "Error loading ingredients" });
      recipe.ingredients = ingResults;
      res.send(recipe);
    });
  });
});

app.get("/recipes", async (req, res) => {
  const cuisine = req.query.cuisine;
  console.log("Fetching recipes with cuisine:", cuisine);

  let query = "SELECT * FROM Recipe";
  const queryParams = [];

  if (cuisine) {
    query += " WHERE Cuisine = ?";
    queryParams.push(cuisine);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching recipes:", err);
      return res.status(500).send("Error fetching recipes");
    }
    res.json(results);
  });
});

// Simple test API
app.get("/test", (req, res) => {
  res.send({ message: "Server is working properly!" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
