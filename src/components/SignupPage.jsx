import { useState } from "react";
import axios from "axios";
import img5 from "../assets/img5.jpg";
import img6 from "../assets/img6.jpg";

export default function SignupPage(params) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      alert("Please fill out all fields.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/signup", {
        username,
        email,
        password,
      });
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("Signup failed!");
    }
  };

  return (
    <>
      <div className="container-fluid" style={{ margin: 0, padding: 0 }}>
        <div className="row">
          <div className="col-md-2">
            <img
              className="w-100 "
              style={{ height: "99vh", objectFit: "cover" }}
              src={img5}
              alt=""
            />
          </div>
          <div className="col-md-3 my-4 py-4 mx-auto">
            <p className="h3">Signup</p>
            <div className="form">
              <form onSubmit={handleSubmit}>
                {/* Username Field */}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    aria-describedby="usernameHelp"
                  />
                </div>

                {/* Email Field */}
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

                {/* Password Field */}
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

                {/* Submit Button */}
                <button type="submit" className="btn btn-dark w-100">
                  Signup
                </button>
              </form>

              <div className="text-center mt-3">
                <p>
                  Already have an account?{" "}
                  <a href="/login" className="text-decoration-none">
                    Login
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <img
              className="w-100 "
              style={{ height: "99vh", objectFit: "cover" }}
              src={img6}
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
}
