import React from "react";
import "./Card.css"

const Card = ({card}) => {
    return (
        <div className="card">
            <img className="card-image" src={card.image_uris.normal} alt={card.name} />
            <p className="card-name">{card.name}</p>
        </div>
    )
}

export default Card;