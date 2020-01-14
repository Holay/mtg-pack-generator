import React from 'react';
import "./StickyNav.scss"
import holayLogo from "../../Holay.png"

const StickyNav = ({ packCount, updatePackCount }) => {
    const numberArray = []
    for (let i = 1; i <= 36; i++) {
        numberArray.push(i)
    }
    function handleChange(event){
        updatePackCount(event.target.value)
    }
    return (
        <div className="nav">
            <div><img className="holay-logo" src={holayLogo} alt="Holay"></img></div>
            <div>Made by Mateo Penagos (<a href="https://twitter.com/Holay63" target="_blank" rel="noopener noreferrer">holay</a>) </div>
            <div className="pack-count-container">
                <span>Booster pack count: </span>
                <select className="pack-count-dropdown" value={packCount} onChange={handleChange}>
                    {numberArray.map(number => <option key={number} value={number}>{number}</option>)}
                </select>
            </div>
        </div>)

}

export default StickyNav;