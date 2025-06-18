export default function SaveRecipeButton(props) {

    const addRecipe = () => {
        props.addRecipe()
    }

    return (props.recipe &&
        <div> 
            <button onClick={addRecipe} className="save-recipe-button">Save this Recipe</button>
        </div>
    )
}