import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/recipe/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error("Error fetching recipe:", err);
        alert("Failed to load recipe");
      }
    };
    fetchRecipe();
  }, [id]);

  if (!recipe) return <div className="text-center my-5">Loading...</div>;

  return (
    <div className="container my-5">
      <button
        onClick={() => navigate("/home")}
        className="btn btn-outline-secondary mb-4"
      >
        ← Back to Home
      </button>

      {/* Banner */}
      <img
        src={recipe.ImageURL}
        alt={recipe.Name}
        className="img-fluid mb-4"
        style={{
          width: "100%",
          height: "300px",
          objectFit: "cover",
          borderRadius: "10px",
        }}
      />

      {/* Title and Author */}
      <h2 className="fw-bold mb-2">{recipe.Name}</h2>
      <p className="text-muted">By {recipe.Username || "Unknown"}</p>

      {/* Meta Info */}
      <div className="row my-3">
        <div className="col-md-3">
          <strong>Prep Time:</strong> {recipe.PrepTime} mins
        </div>
        <div className="col-md-3">
          <strong>Cook Time:</strong> {recipe.CookTime} mins
        </div>
        <div className="col-md-3">
          <strong>Servings:</strong> {recipe.Servings}
        </div>
        <div className="col-md-3">
          <strong>Cuisine:</strong> {recipe.Cuisine}
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <h5>Description</h5>
        <p>{recipe.Description}</p>
      </div>

      {/* Diet Type and Nutrition */}
      <div className="row mb-4">
        <div className="col-md-6">
          <h5>Diet Type</h5>
          <p>{recipe.DietType || "N/A"}</p>
        </div>
        <div className="col-md-6">
          <h5>Nutrition Info</h5>
          <p>{recipe.Nutrition || "N/A"}</p>
        </div>
      </div>

      {/* Ingredients */}
      <div className="mb-4">
        <h5>Ingredients</h5>
        <ul>
          {recipe.ingredients?.map((item, index) => (
            <li key={index}>{item.Name || item}</li>
          ))}
        </ul>
      </div>

      {/* Steps (optional placeholder for future) */}
      {/* <div className="mb-4">
        <h5>Steps</h5>
        <ol>
          {recipe.steps?.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div> */}
    </div>
  );
}
