import { useState, useEffect } from "react"

export default function Recipe(props) {
    const [splitRecipe, setSplitRecipe] = useState([]);
    const [formattedRecipe, setFormattedRecipe] = useState("");

    useEffect(() => {
        if (props.recipe) setSplitRecipe(props.recipe.split("\n"))
    }, [props.recipe])

    useEffect(() => {
        if (splitRecipe) setFormattedRecipe(splitRecipe.map((step, index) => {return <div className="recipe-step" key={index}>{step}</div>}))
    }, [splitRecipe])

    return (props.recipe &&
        <div className="recipe">
            {formattedRecipe}
            <hr className="horizontal-break" />
        </div>
    )
}