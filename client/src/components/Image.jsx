import { useState, useEffect } from 'react';

export default function Image(props) {

    const [youTubeUrl, setYouTubeUrl] = useState("")

    useEffect (() => {
        if (props.youTubeUrl) {
            var firstSplit = props.youTubeUrl.split("watch");
            var secondSplit = firstSplit[1].split("=");
            setYouTubeUrl(firstSplit[0] + "embed/" + secondSplit[1]);
        }
    }, [props.youTubeUrl]);

    function Video() {
        return (
            <iframe title="youtube video" src={youTubeUrl} className="video"></iframe>
        )
    }

    function Image() {
        return (
            <img src={props.thumbNail} alt="recipe image" className="recipe-image"></img>
        )
    }

    return (
        <div>
            {youTubeUrl ? <Video /> : props.thumbNail ? <Image /> : null}
            <hr className="horizontal-break" />
        </div>
    )
}