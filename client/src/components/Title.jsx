export default function Title(props) {

    return (
        <div id="title">
            <h2>{props.title}</h2>
            <h3>{props.nationality}</h3>
            <h3>{props.category}</h3>
        </div>
    )
}