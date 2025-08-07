import SavedRecipe from "./fragments/SavedRecipe"
import SaveRecipeButton from "./fragments/SaveRecipeButton"

export default function SavedRecipes(props) {

    const addRecipe = () => {
        props.saveRecipe()
    }

    const deleteRecipe = (id) => {
        props.deleteRecipe(id)
    }
    console.log(props.recipes)
    const recipeButtons = props.recipes.map((recipe, index) => {
        return <SavedRecipe name = {recipe.name} mealId = {recipe.idMeal} mealImage = {recipe.image} setRecipe = {props.setRecipe} key = {index} deleteRecipe = {deleteRecipe}/>
    })

    return (
        <div className="saved-recipe-container"> 
            <SaveRecipeButton addRecipe = {addRecipe} recipe = {props.recipe} key = {props.idMeal} />
            <h3>Saved Recipes</h3>
            <ul className="recipe-list">
                {recipeButtons}
            </ul>
        </div>
    )
}