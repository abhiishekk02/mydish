import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import img7 from "../assets/img7.jpg";
import img8 from "../assets/img8.jpg";
import img9 from "../assets/img9.jpg";
import img10 from "../assets/img10.jpg";
import img11 from "../assets/img11.jpg";
import img12 from "../assets/img12.jpg";

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get("/recipes");
        const recipes = res.data;

        // Shuffle the array randomly
        const shuffledRecipes = recipes.sort(() => 0.5 - Math.random());

        setRecipes(shuffledRecipes);
      } catch (error) {
        console.error("Failed to fetch recipes", error);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (!user) {
    // Optional: Prevents rendering until user is loaded
    return null;
  }

  return (
    <>
      <div style={{ position: "relative", width: "90%", margin: "30px auto" }}>
        <img
          src={img7}
          alt="MyDishDB Banner"
          style={{
            width: "100%",
            height: "240px",
            objectFit: "cover",
            borderRadius: "16px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "5%",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          Welcome! {user?.Username}! <br />
          <span style={{ color: "#6A2408" }}>
            Let’s Find Your <br />
            Next Favorite Recipe.
          </span>
        </div>
      </div>

      {/* SearchBar */}
      <div className="container">
        <p style={{ color: "#727292", fontSize: "24px" }}>
          Search for a recipe
        </p>

        <div className="searchbar d-flex">
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search for recipes, ingredients, or cuisines..."
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <button
            className="btn btn-dark"
            style={{
              marginLeft: "10px",
              padding: "10px 20px",
              borderRadius: "40px",
            }}
          >
            <i className="fas fa-search" style={{ marginRight: "6px" }}></i>
            Search
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="container">
        <p className="h5" style={{ color: "#817B7B", marginTop: "30px" }}>
          Explore Categories
        </p>
        <div className="row">
          <div className="col-md-3">
            <div
              className="card"
              onClick={() => navigate("/cuisine/Indian")}
              style={{ cursor: "pointer" }}
            >
              <img src={img8} className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Indian</h5>
                <p className="card-text" style={{ color: "#4B4469" }}>
                  Spices, Tradition, and Bold Flavors.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3 ">
            <div
              className="card"
              onClick={() => navigate("/cuisine/Italian")}
              style={{ cursor: "pointer" }}
            >
              <img
                src={img9}
                className="card-img-top "
                style={{ aspectRatio: "3/2", objectFit: "cover" }}
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title">Italian</h5>
                <p className="card-text" style={{ color: "#4B4469" }}>
                  Authentic Taste, Made with Love.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div
              className="card"
              onClick={() => navigate("/cuisine/Chinese")}
              style={{ cursor: "pointer" }}
            >
              <img src={img10} className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Chinese</h5>
                <p className="card-text" style={{ color: "#4B4469" }}>
                  Wok-Fired Perfection in Every Bite.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div
              className="card"
              onClick={() => navigate("/cuisine/Mexican")}
              style={{ cursor: "pointer" }}
            >
              <img src={img11} className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Mexican</h5>
                <p className="card-text" style={{ color: "#4B4469" }}>
                  Vibrant, Zesty, and Full of Life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5" style={{ position: "relative" }}>
        <img
          src={img12}
          alt="Add Recipe Banner"
          style={{
            width: "100%",
            height: "240px",
            objectFit: "cover",
            borderRadius: "16px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "5%",
            fontSize: "24px",
            fontWeight: "bold",
            color: "white",
            textShadow: "1px 1px 6px rgba(0, 0, 0, 0.7)",
          }}
        >
          Add a Recipe
          <br />
          Share Your Recipe, Inspire Others!
        </div>
        <button
          onClick={() => navigate("/add-recipe")}
          className="btn btn-dark"
          style={{
            position: "absolute",
            top: "65%",
            left: "5%",
            padding: "10px 20px",
            borderRadius: "20px",
            fontWeight: "bold",
          }}
        >
          Add Now
        </button>
      </div>

      <div className="container my-5">
        <h3 className="fw-bold mb-4" style={{ color: "#2A2E81" }}>
          Explore Random Recipes
        </h3>
        <div className="row">
          {recipes.length === 0 ? (
            <p>No recipes available.</p>
          ) : (
            recipes.slice(0, 8).map(
              (
                recipe // show first 8 recipes
              ) => (
                <div className="col-md-3 mb-4" key={recipe.RecipeID}>
                  <div
                    className="card h-100"
                    style={{
                      cursor: "pointer",
                      border: "none",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    }}
                    onClick={() => navigate(`/recipe/${recipe.RecipeID}`)}
                  >
                    <img
                      src={recipe.ImageURL}
                      className="card-img-top"
                      alt={recipe.Name}
                      style={{
                        height: "200px",
                        objectFit: "cover",
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                      }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{recipe.Name}</h5>
                      <p
                        className="card-text"
                        style={{ fontSize: "14px", color: "#777" }}
                      >
                        Prep Time: {recipe.PrepTime} mins
                      </p>
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    </>
  );
}
