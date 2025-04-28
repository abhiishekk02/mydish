import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import img7 from "../assets/img7.jpg";
import img8 from "../assets/img8.jpg";
import img9 from "../assets/img9.jpg";
import img10 from "../assets/img10.jpg";
import img11 from "../assets/img11.jpg";

export default function HomePage({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

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
            <div className="card">
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
            <div className="card">
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
            <div className="card">
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
            <div className="card">
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
    </>
  );
}
