import SingleIngredient from "./fragments/SingleIngredient";

export default function Ingredients(props) {

    const ingredients = Object.keys(props.recipe)
        .filter(key => key.includes("strIngredient") && props.recipe[key] !== "")
        .map(key => props.recipe[key]);
        
    const measurements = Object.keys(props.recipe)
        .filter(key => key.includes("strMeasure") && (props.recipe[key] !== ""))
        .map(key => props.recipe[key]);

    const matchedItems = ingredients.map((ingredient, index) => ({
        ingredient,
        measurement: measurements[index]
    }));

    return (props.recipe &&
        <div className="ingredients">
            <h3>Ingredients</h3>
            {matchedItems.map((item, index) => (
                <SingleIngredient key = {index} ingredient = {item.ingredient} measurement = {item.measurement} />
            ))}
            <hr className="horizontal-break" />
        </div>
    );
};