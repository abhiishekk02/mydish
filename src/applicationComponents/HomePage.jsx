import { useState, useEffect, useRef } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedQuery, setDisplayedQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const searchRef = useRef(null);

  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navigate]);

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const res = await axios.get("/recipes");
        const shuffledRecipes = [...res.data].sort(() => 0.5 - Math.random());
        setRecipes(shuffledRecipes);
      } catch (error) {
        console.error("Failed to fetch recipes", error);
      }
    };

    fetchAllRecipes();
  }, []);

  useEffect(() => {
   
    if (isSearchPerformed) {
      return;
    }
    
    const getSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      
      try {
        const res = await axios.get("/search/suggestions", {
          params: { query: searchQuery }
        });
        
        if (res.data.suggestions.length > 0) {
          setSuggestions(res.data.suggestions);
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setShowSuggestions(false);
      }
    };
    
    const debounceTimer = setTimeout(getSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, isSearchPerformed]);

  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    
    if (isSearchPerformed && value !== displayedQuery) {
      setIsSearchPerformed(false);
    }
  };

  
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    setDisplayedQuery(searchQuery);
    setShowSuggestions(false);
    setIsSearchPerformed(true);
    
    try {
      
      setSearchResults([]);
      
      
      const res = await axios.get("/recipes/search", { 
        params: { 
          query: searchQuery,
          timestamp: new Date().getTime() 
        }
      });
      
     
      const recipeMap = new Map();
      
      res.data.forEach(recipe => {
        if (!recipeMap.has(recipe.RecipeID)) {
          recipeMap.set(recipe.RecipeID, recipe);
        }
      });
      
      const uniqueResults = Array.from(recipeMap.values());
      console.log(`Search for "${searchQuery}" returned ${uniqueResults.length} unique recipes after frontend deduplication`);
      
      setSearchResults(uniqueResults);
      setIsSearching(false);
    } catch (error) {
      console.error("Error with search:", error);
      setIsSearching(false);
    }
  };

 
  const handleSuggestionClick = async (suggestion) => {
    const selectedQuery = suggestion.text;
    setSearchQuery(selectedQuery);
    setDisplayedQuery(selectedQuery);
    setShowSuggestions(false);
    setIsSearchPerformed(true);
    
    try {
      setIsSearching(true);
      const res = await axios.get("/recipes/search", { 
        params: { query: selectedQuery }
      });
      
      
      const uniqueResults = Array.from(
        new Map(res.data.map(item => [item.RecipeID, item])).values()
      );
      
      setSearchResults(uniqueResults);
      setIsSearching(false);
    } catch (error) {
      console.error("Failed to fetch search results for suggestion", error);
      setIsSearching(false);
    }
  };

  
  const handleCuisineClick = async (cuisine) => {
    setSearchQuery(cuisine);
    setDisplayedQuery(cuisine);
    setShowSuggestions(false);
    setIsSearchPerformed(true);
    
    try {
      setIsSearching(true);
      const res = await axios.get("/recipes/search", { 
        params: { query: cuisine }
      });
      
     
      const uniqueResults = Array.from(
        new Map(res.data.map(item => [item.RecipeID, item])).values()
      );
      
      setSearchResults(uniqueResults);
      setIsSearching(false);
    } catch (error) {
      console.error(`Failed to fetch ${cuisine} recipes`, error);
      setIsSearching(false);
    }
  };

  if (!user) {
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
            Let's Find Your <br />
            Next Favorite Recipe.
          </span>
        </div>
      </div>

      {/* SearchBar */}
      <div className="container">
        <p style={{ color: "#727292", fontSize: "24px" }}>
          Search for a recipe
        </p>

        <div className="searchbar d-flex position-relative" ref={searchRef}>
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search for recipes, ingredients, or cuisines..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => {
              
              if (searchQuery.length >= 2 && !isSearchPerformed) {
                setShowSuggestions(true);
              }
            }}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <button
            className="btn btn-dark"
            onClick={handleSearch}
            style={{
              marginLeft: "10px",
              padding: "10px 20px",
              borderRadius: "40px",
            }}
          >
            <i className="fas fa-search" style={{ marginRight: "6px" }}></i>
            Search
          </button>
          
          {showSuggestions && suggestions.length > 0 && !isSearchPerformed && (
            <div 
              className="position-absolute w-50 bg-white shadow-sm rounded-bottom border"
              style={{ 
                zIndex: 1000,
                maxHeight: "300px",
                overflowY: "auto",
                top: "45px"
              }}
            >
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  className="p-2 border-bottom suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{ 
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <i className={`me-2 fas ${
                    suggestion.type === 'recipe' ? 'fa-utensils' : 
                    suggestion.type === 'ingredient' ? 'fa-carrot' : 
                    'fa-globe'
                  }`}></i>
                  <span>
                    {suggestion.text} 
                    <small className="text-muted ms-2">
                      ({suggestion.type})
                    </small>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="container my-4">
          <h3 className="fw-bold mb-3" style={{ color: "#2A2E81" }}>
            {isSearching 
              ? "Searching..." 
              : `Search Results for "${displayedQuery}"`}
          </h3>
          
          {!isSearching && (
            <p className="text-muted mb-3">
              Found {searchResults.length} {searchResults.length === 1 ? "recipe" : "recipes"}
            </p>
          )}
          
          <div className="row">
            {isSearching ? (
              <div className="col-12 text-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              searchResults.slice(0, 4).map((recipe) => (
                <div className="col-md-3 mb-4" key={recipe.RecipeID}>
                  <div
                    className="card h-100"
                    style={{
                      cursor: "pointer",
                      border: "none",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      transition: "transform 0.2s",
                    }}
                    onClick={() => navigate(`/recipe/${recipe.RecipeID}`)}
                    onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    <div className="position-relative">
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
                      {recipe.Cuisine && (
                        <span 
                          className="position-absolute top-0 end-0 badge rounded-pill bg-light text-dark m-2"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {recipe.Cuisine}
                        </span>
                      )}
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{recipe.Name}</h5>
                      <div className="d-flex justify-content-between">
                        <p className="card-text" style={{ fontSize: "14px", color: "#777" }}>
                          <i className="far fa-clock me-1"></i> {recipe.PrepTime + recipe.CookTime} mins
                        </p>
                        <p className="card-text" style={{ fontSize: "14px", color: "#777" }}>
                          <i className="fas fa-utensils me-1"></i> {recipe.Servings} servings
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* View more button for search results */}
          {searchResults.length > 4 && (
            <div className="text-center mt-2 mb-4">
              <button 
                className="btn btn-outline-dark rounded-pill px-4 py-2"
                onClick={() => navigate("/all-recipes", { 
                  state: { searchQuery: displayedQuery } 
                })}
              >
                View All Results
              </button>
            </div>
          )}
        </div>
      )}

      {/* Categories */}
      <div className="container">
        <p className="h5" style={{ color: "#817B7B", marginTop: "30px" }}>
          Explore Categories
        </p>
        <div className="row">
          <div className="col-md-3">
            <div
              className="card"
              onClick={() => handleCuisineClick("Indian")}
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
              onClick={() => handleCuisineClick("Italian")}
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
              onClick={() => handleCuisineClick("Chinese")}
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
              onClick={() => handleCuisineClick("Mexican")}
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
            recipes.slice(0, 8).map((recipe) => (
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
            ))
          )}
        </div>
      </div>
    </>
  );
}