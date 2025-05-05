import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";

export default function LoginPage(params) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill out all fields.");
      return;
    }
    try {
      const response = await axios.post(
        "https://mydishdb-apple12345.ue.r.appspot.com/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } } // ADD THIS
      );

      alert(response.data.message);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/home");
    } catch (error) {
      console.error(error);
      alert("Login failed! Please check your credentials.");
    }
  };

  return (
    <>
      <div className="container-fluid" style={{ margin: 0, padding: 0 }}>
        <div className="row">
          <div className="col-md-7">
            <img
              className="w-100"
              style={{ height: "99vh", objectFit: "cover" }}
              src={img3}
              alt=""
            />
          </div>
          <div className="col-md-3 my-4 py-4 mx-auto">
            <p className="h3">Login</p>
            <div className="form">
              <form onSubmit={login}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-describedby="emailHelp"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-dark w-100">
                  Login
                </button>
              </form>
              <div className="text-center mt-3">
                <p>
                  Don't have an account?{" "}
                  <a href="/signup" className="text-decoration-none">
                    Sign Up
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <img
              className="w-100"
              style={{ height: "99vh", objectFit: "cover" }}
              src={img4}
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
}
