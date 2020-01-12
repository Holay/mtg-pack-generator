import React, {useState} from "react";
import "./Card.css"

const Card = ({card}) => {
    const dual = card.image_uris? false:true;
    const [currentFace, setCurrentFace] = useState(dual?card.card_faces[0].image_uris.normal:[])
    function handleFlip(){
        if(dual){
            setCurrentFace(card.card_faces.find(face=>face.image_uris.normal !== currentFace).image_uris.normal)
        }
    }
    return (
        <div className="card">
            <img className="card-image" onClick={handleFlip} src={dual ? currentFace:card.image_uris.normal} alt={card.name} />
            <p className="card-name">{card.name}</p>
        </div>
    )
}

export default Card;