export default function SavedRecipe(props) {

  const getRecipeButton = document.getElementsByClassName("recipe-button");
  
  async function getSavedRecipe() {
      try {
          const response = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + props.mealId);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          let json = await response.json();
          props.setRecipe(json.meals[0]);
      } catch (e) {
        console.error(e);
      }
  }

  const deleteRecipe = () => {
    props.deleteRecipe(props.mealId);
  }

  const scrollToImage = () => {
    getRecipeButton[0].scrollIntoView();
  }

  const handleClick = () => {
    getSavedRecipe();
    scrollToImage();
  }

  return (
    <div className="single-recipe-container">
      <img src={props.mealImage} className="image-thumbnail" />
      <li className="recipe-list-item">
        <button className="saved-recipe-button" onClick={handleClick}>{props.name}</button>
        <button className="delete-recipe-button" onClick={deleteRecipe}>X</button>
      </li>
    </div>
  )
}