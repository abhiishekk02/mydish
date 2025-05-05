const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const db = mysql.createConnection({
  host: "34.136.223.174",
  user: "adminuser",
  password: "admin123",
  database: "RecipeAppDB",
});

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

app.get("/users", (req, res) => {
  db.query("SELECT UserID, Username, Email FROM User", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Error fetching users" });
    }
    res.send(results);
  });
});

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

      res.send(results[0]);
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
    cuisine,
    userId,
    dietType,
    nutrition,
  } = req.body;

  const insertRecipeQuery = `
    INSERT INTO Recipe (
      Name, Description, PrepTime, CookTime, Servings, ImageURL,
      Cuisine, UserID, DietType, Nutrition
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      dietType,
      nutrition,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: "Error adding recipe." });
      }

      const recipeId = result.insertId;
      const ingredientNames = ingredients.split(",").map((item) => item.trim());

      if (ingredientNames.length === 0) {
        return res.send({ message: "Recipe added without ingredients." });
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

app.delete("/recipe/:id", (req, res) => {
  const recipeId = req.params.id;

  const deleteRecipeQuery = "DELETE FROM Recipe WHERE RecipeID = ?";

  db.query(deleteRecipeQuery, [recipeId], (err, result) => {
    if (err) {
      console.error("Error deleting recipe:", err);
      return res.status(500).send({ message: "Error deleting recipe." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Recipe not found." });
    }

    res.status(200).send({ message: "Recipe deleted successfully." });
  });
});

app.put("/user/:id/password", async (req, res) => {
  const userId = req.params.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).send({ message: "Both passwords are required." });
  }

  // Fetch user's current hashed password
  db.query(
    "SELECT PasswordHash FROM User WHERE UserID = ?",
    [userId],
    async (err, results) => {
      if (err) return res.status(500).send({ message: "Database error." });
      if (results.length === 0)
        return res.status(404).send({ message: "User not found." });

      const isMatch = await bcrypt.compare(
        currentPassword,
        results[0].PasswordHash
      );
      if (!isMatch) {
        return res
          .status(401)
          .send({ message: "Current password is incorrect." });
      }

      const newHashed = await bcrypt.hash(newPassword, 10);
      db.query(
        "UPDATE User SET PasswordHash = ? WHERE UserID = ?",
        [newHashed, userId],
        (updateErr) => {
          if (updateErr)
            return res
              .status(500)
              .send({ message: "Error updating password." });
          res.send({ message: "Password updated successfully." });
        }
      );
    }
  );
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
app.get("/search/suggestions", (req, res) => {
  const { query } = req.query;

  if (!query || query.length < 2) {
    return res.json({ suggestions: [] });
  }

  const promises = [
    new Promise((resolve, reject) => {
      db.query(
        "SELECT DISTINCT Name as text, 'recipe' as type FROM Recipe WHERE Name LIKE ? LIMIT 5",
        [`%${query}%`],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    }),

    new Promise((resolve, reject) => {
      db.query(
        "SELECT DISTINCT Name as text, 'ingredient' as type FROM Ingredient WHERE Name LIKE ? LIMIT 5",
        [`%${query}%`],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    }),

    new Promise((resolve, reject) => {
      db.query(
        "SELECT DISTINCT Cuisine as text, 'cuisine' as type FROM Recipe WHERE Cuisine LIKE ? AND Cuisine IS NOT NULL LIMIT 5",
        [`%${query}%`],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    }),
  ];

  Promise.all(promises)
    .then((results) => {
      const suggestions = results.flat().slice(0, 10);
      res.json({ suggestions });
    })
    .catch((error) => {
      console.error("Error getting search suggestions:", error);
      res.status(500).json({ error: "Failed to get suggestions" });
    });
});

app.get("/recipes/search", (req, res) => {
  const { query, sortBy, sortOrder } = req.query;

  let sqlQuery = `
    SELECT r.* 
    FROM Recipe r
    WHERE r.RecipeID IN (
      SELECT DISTINCT r2.RecipeID
      FROM Recipe r2
      LEFT JOIN RecipeIngredient ri ON r2.RecipeID = ri.RecipeID
      LEFT JOIN Ingredient i ON ri.IngredientID = i.IngredientID
      WHERE (r2.Name LIKE ? OR r2.Description LIKE ? OR r2.Cuisine LIKE ? OR i.Name LIKE ?)
    )
  `;

  const params = [];

  if (query) {
    params.push(`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`);
  } else {
    sqlQuery = `SELECT * FROM Recipe`;
  }

  if (sortBy) {
    const validSortColumns = ["Name", "PrepTime", "CookTime", "CreatedAt"];
    const validSortOrders = ["ASC", "DESC"];

    const column = validSortColumns.includes(sortBy) ? sortBy : "Name";
    const order = validSortOrders.includes(sortOrder?.toUpperCase())
      ? sortOrder.toUpperCase()
      : "ASC";

    sqlQuery += ` ORDER BY ${column} ${order}`;
  } else {
    sqlQuery += ` ORDER BY Name ASC`;
  }

  console.log("Executing search query:", sqlQuery);
  console.log("With parameters:", params);

  db.query(sqlQuery, params, (err, results) => {
    if (err) {
      console.error("Error searching recipes:", err);
      return res.status(500).send({ message: "Error searching recipes" });
    }

    console.log(
      `Search for "${query}" returned ${results.length} unique recipes`
    );
    res.status(200).json(results);
  });
});

app.get("/test", (req, res) => {
  res.send({ message: "Server is working properly!" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
