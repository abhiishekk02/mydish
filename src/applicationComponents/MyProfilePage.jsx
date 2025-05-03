import { useEffect, useState } from "react";
import axios from "axios";

export default function MyProfilePage() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Now fetch this user's recipes
      axios
        .get(`http://localhost:3000/recipes/user/${parsedUser.UserID}`)
        .then((response) => {
          setRecipes(response.data);
        })
        .catch((error) => {
          console.error("Error fetching recipes:", error);
        });
    }
  }, []);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    alert("Password change functionality coming soon!");
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
              <div className="card" style={{ width: "18rem" }}>
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
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
