import './App.css'
import { useState, useEffect } from 'react';
import Title from './components/Title';
import Image from './components/Image';
import Recipe from './components/Recipe';
import Ingredients from './components/Ingredients';
import Header from './components/Header';
import SavedRecipeContainer from './components/SavedRecipeContainer';

function App() {

  const [loggedIn, setLoggedIn] = useState(null)
  const [recipe, setRecipe] = useState("")
  const [recipes, setRecipes] = useState(() => {
    const storageRecipes = localStorage.getItem("recipes");
    return storageRecipes ? JSON.parse(storageRecipes) : [];
  })
  
  useEffect(() => {
    const retrievedRecipes = localStorage.getItem("recipes")
  }, [recipes])

  useEffect(() => {
    checkAuth();
  }, []);

async function checkAuth() {
  try {
    const res = await fetch('http://localhost:3500/auth/check-auth', {
      method: 'GET',
      credentials: 'include',
    });

    if (res.status === 401 || res.status === 403) {
      // Access token expired → try to refresh
      const newAccessToken = await refreshAccessToken();

      if (!newAccessToken) throw new Error('Could not refresh');

      // Retry the original request with new access token if needed (if your backend supports it)
      const retryRes = await fetch('http://localhost:3500/auth/check-auth', {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
      });

      if (!retryRes.ok) throw new Error('Retry failed');

      const retryData = await retryRes.json();

      setLoggedIn(retryData.loggedIn);
      return;
    }

    const data = await res.json();
    setLoggedIn(data.loggedIn);
  } catch (err) {
    console.error('Auth check failed', err);
    setLoggedIn(false);
  }
}

  async function refreshAccessToken() {
    try {
      const res = await fetch('http://localhost:3500/auth/refresh', {
        method: 'GET',
        credentials: 'include', // Important: sends HTTP-only cookie
      });

      console.log('refresh response', res)

      if (!res.ok) throw new Error('Refresh failed');

      const data = await res.json(); // data.accessToken or similar
      return data.accessToken;
    } catch (err) {
      console.error('Failed to refresh token', err);
      return null;
    }
  }

  async function fetchRecipe() {
    try {
      const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      let json = await response.json();
      setRecipe(json.meals[0])
    } catch (e) {
      console.error(e)
    }
    console.log(recipe)
  }

  function checkForDuplicates(recipes, id) {
    return recipes.some(obj => obj.idMeal === id);
  }

  function saveRecipe() {
    const newRecipe = {"name": recipe.strMeal, "idMeal": recipe.idMeal}
    const recipeDoesExist = checkForDuplicates(recipes, newRecipe.idMeal)
    if (recipeDoesExist || !newRecipe.idMeal) {
      alert("This recipe is already saved")
    } else {
      localStorage.setItem("recipes", JSON.stringify([...recipes, newRecipe]));
      setRecipes(prevRecipes => [...prevRecipes, newRecipe])
    }
  }

  function deleteRecipe(id) {
    const newRecipeArray = recipes.filter(recipe => recipe.idMeal !== id)
    localStorage.setItem("recipes", JSON.stringify(newRecipeArray));
    setRecipes(newRecipeArray)
  }

  return (
    <>
      <Header loggedIn = {loggedIn} />
      <h1>Recipe Roulette</h1>
      <img src="../src/assets/images/empty-bowl-md.png" alt="empty bowl"></img>
      <p>The random recipe generator</p>
      <button className="recipe-button" onClick={fetchRecipe}>
        generate a new recipe!
      </button>
      <Title title = {recipe.strMeal} nationality={recipe.strArea} category = {recipe.strCategory}/>
      <Image youTubeUrl = {recipe.strYoutube} thumbNail = {recipe.strMealThumb} />
      <Recipe recipe = {recipe.strInstructions} />
      <Ingredients recipe = {recipe} />
      <SavedRecipeContainer recipe = {recipe} recipes = {recipes} saveRecipe = {saveRecipe} deleteRecipe = {deleteRecipe} setRecipe={setRecipe} setRecipes={setRecipes} />
    </>
  )
}

export default App
