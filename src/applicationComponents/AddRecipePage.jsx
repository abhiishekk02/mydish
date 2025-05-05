import { useState } from "react";
import axios from "axios";
import img13 from "../assets/img13.jpg";
import { useNavigate } from "react-router-dom";

export default function AddRecipePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    recipeName: "",
    description: "",
    ingredients: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    imageUrl: "",
    cuisine: "",
    dietType: "",
    nutrition: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("User not logged in!");
      return;
    }

    try {
      const response = await axios.post(
        "https://mydishdb-apple12345.ue.r.appspot.com/add-recipe",
        {
          recipeName: formData.recipeName,
          description: formData.description,
          ingredients: formData.ingredients,
          prepTime: formData.prepTime,
          cookTime: formData.cookTime,
          servings: formData.servings,
          imageUrl: formData.imageUrl,
          userId: user.UserID,
          cuisine: formData.cuisine,
        }
      );

      console.log(response.data);
      alert("Recipe submitted successfully!");

      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert("Failed to submit recipe. Please try again.");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-bold" style={{ color: "#2A2E81" }}>
        Add Your Delicious Recipe
      </h2>
      <div className="row">
        {/* Image Section */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <img
            src={img13}
            alt="Recipe Preview"
            className="img-fluid"
            style={{
              maxHeight: "700px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        </div>

        {/* Form Section */}
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Recipe Name</label>
              <input
                type="text"
                className="form-control"
                name="recipeName"
                value={formData.recipeName}
                onChange={handleChange}
                placeholder="e.g., Butter Chicken"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Describe your recipe..."
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Ingredients</label>
              <textarea
                className="form-control"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                rows="3"
                placeholder="List ingredients separated by commas..."
                required
              ></textarea>
            </div>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">
                  Prep Time (mins)
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleChange}
                  placeholder="30"
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">
                  Cook Time (mins)
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="cookTime"
                  value={formData.cookTime}
                  onChange={handleChange}
                  placeholder="45"
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Servings</label>
                <input
                  type="number"
                  className="form-control"
                  name="servings"
                  value={formData.servings}
                  onChange={handleChange}
                  placeholder="4"
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Cuisine</label>
              <select
                className="form-select"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                required
              >
                <option value="">Select Cuisine</option>
                <option value="Indian">Indian</option>
                <option value="Italian">Italian</option>
                <option value="Chinese">Chinese</option>
                <option value="Mexican">Mexican</option>
                <option value="American">American</option>
                <option value="Thai">Thai</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Diet Type</label>
              <select
                className="form-select"
                name="dietType"
                value={formData.dietType}
                onChange={handleChange}
                required
              >
                <option value="">Select Diet Type</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Gluten-Free">Gluten-Free</option>
                <option value="Keto">Keto</option>
                <option value="Paleo">Paleo</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Nutrition Info</label>
              <textarea
                className="form-control"
                name="nutrition"
                value={formData.nutrition}
                onChange={handleChange}
                rows="3"
                placeholder="e.g., 250 calories, 15g protein, etc."
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Image URL</label>
              <input
                type="text"
                className="form-control"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="Paste an image link here..."
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-dark">
                Submit Recipe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
