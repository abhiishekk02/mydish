import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RecipeListPage() {
  const { cuisine } = useParams();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios
      .get(
        `https://mydishdb-apple12345.ue.r.appspot.com/recipes/cuisine/${cuisine}`
      )
      .then((res) => setRecipes(res.data))
      .catch((err) => console.error("Error loading recipes:", err));
  }, [cuisine]);

  return (
    <div className="container my-5">
      <h2 className="mb-4">Showing {cuisine} Recipes</h2>
      <div className="row">
        {recipes.map((recipe) => (
          <div className="col-md-4 mb-4" key={recipe.RecipeID}>
            <div className="card">
              <img
                src={recipe.ImageURL}
                className="card-img-top"
                alt={recipe.Name}
              />
              <div className="card-body">
                <h5 className="card-title">{recipe.Name}</h5>
                <p className="card-text">Prep: {recipe.PrepTime} mins</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
