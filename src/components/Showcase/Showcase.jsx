import React from 'react'
import { Card } from "../index"
import "./Showcase.css"

const Showcase = ({ cards }) => {
    let showCaseBlocks = []

    for (const cardType in cards) {
        if (cards[cardType]) {
            const block = {
                header: cardType,
                cards: cards[cardType].map((card, index) => <Card card={card} key={index} />)
            }
            showCaseBlocks.push(block)
        }
    }
    showCaseBlocks.reverse()
    console.log(showCaseBlocks, 'normal result')
    const showcaseData = showCaseBlocks.filter(block=>block.cards.length>0).map((block, index) => {
        return (
            <div className="showcase-block" key={`${block.cardType}-${index}`}>
                <div className="showcase-header">
                    <span>{block.cards.length > 0 && block.header}</span>
                </div>
                <div className="showcase-cards"> {block.cards} </div>
            </div>
        )
    })

    return (

        <div className="showcase-block">
            {showcaseData}
        </div>
    )
}

export default Showcase