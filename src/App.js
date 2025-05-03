import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Main from "./components/HomePage";
import HomePage from "./applicationComponents/HomePage";

import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import MyProfilePage from "./applicationComponents/MyProfilePage";
import AddRecipePage from "./applicationComponents/AddRecipePage";
import RecipeDetailsPage from "./applicationComponents/RecipeDetailsPage";
import RecipeListPage from "./applicationComponents/RecipeListPage";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<MyProfilePage />} />
        <Route path="/add-recipe" element={<AddRecipePage />} />
        <Route path="/recipe/:id" element={<RecipeDetailsPage />} />
        <Route path="/recipes" element={<RecipeListPage />} />
      </Routes>
    </div>
  );
}

export default App;
