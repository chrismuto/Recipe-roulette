import { useState } from "react"

export default function SingleIngredient(props) {

        const [isStruckThrough, setIsStruckThrough] = useState(false)

        const toggleStrikeThrough = () => {
            setIsStruckThrough(!isStruckThrough)
        }
    return (props.ingredient &&
        <li
            className="single-ingredient"
            style = {{textDecoration: isStruckThrough ? 'line-through' : 'none'}}
            data-toggle = {isStruckThrough ? true : false}
            onClick={toggleStrikeThrough}
        >
            {props.ingredient}: {props.measurement}
        </li>
    )
}