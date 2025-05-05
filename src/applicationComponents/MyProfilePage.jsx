import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function MyProfilePage() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      fetchUserRecipes(parsedUser.UserID);
    }
  }, []);
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      return alert("Please fill in both password fields.");
    }

    try {
      const res = await axios.put(
        `https://mydishdb-apple12345.ue.r.appspot.com/user/${user.UserID}/password`,
        {
          currentPassword,
          newPassword,
        }
      );

      alert(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Password update failed:", error);
      alert(error.response?.data?.message || "Failed to update password.");
    }
  };

  const fetchUserRecipes = (userId) => {
    axios
      .get(
        `https://mydishdb-apple12345.ue.r.appspot.com/recipes/user/${userId}`
      )
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
      });
  };

  const handleDelete = (recipeId) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      axios
        .delete(
          `https://mydishdb-apple12345.ue.r.appspot.com/recipe/${recipeId}`
        )
        .then(() => {
          alert("Recipe deleted successfully.");
          setRecipes(recipes.filter((r) => r.RecipeID !== recipeId));
        })
        .catch((error) => {
          console.error("Failed to delete recipe:", error);
          alert("Failed to delete recipe.");
        });
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">My Profile</h2>
      {user && (
        <div className="mb-5">
          <p>
            <strong>Name:</strong> {user.Username}
          </p>
          <p>
            <strong>Email:</strong> {user.Email}
          </p>
        </div>
      )}
      <h5>Change Password</h5>
      <form onSubmit={handlePasswordChange} className="d-flex mb-5">
        <input
          type="password"
          placeholder="Enter Current Password"
          className="form-control me-1"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter New Password"
          className="form-control me-1"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-dark">
          Change Password
        </button>
      </form>

      <h5>My Recipes</h5>
      <div className="row">
        {recipes.length === 0 ? (
          <p>You have not added any recipes yet.</p>
        ) : (
          recipes.map((recipe) => (
            <div className="col-md-4 mb-4" key={recipe.RecipeID}>
              <div
                className="card"
                style={{ width: "18rem", cursor: "pointer" }}
                onClick={() => navigate(`/recipe/${recipe.RecipeID}`)}
              >
                <img
                  src={recipe.ImageURL || "https://via.placeholder.com/150"}
                  className="card-img-top"
                  alt="Recipe"
                  style={{ objectFit: "cover", height: "200px" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{recipe.Name}</h5>
                  <p className="card-text">
                    {recipe.Description.slice(0, 50)}...
                  </p>
                  <button
                    className="btn btn-sm btn-danger mt-2"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation
                      handleDelete(recipe.RecipeID);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
