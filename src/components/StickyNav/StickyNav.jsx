import React from 'react';
import "./StickyNav.scss"
import holayLogo from "../../Holay.png";
import ReactTooltip from 'react-tooltip'

const StickyNav = ({ packCount, updatePackCount, toggleBoosterPackaging, boosterPackaging }) => {
    const numberArray = []
    for (let i = 1; i <= 36; i++) {
        numberArray.push(i)
    }
    function handleChange(event) {
        updatePackCount(event.target.value)
    }
    return (
        <div className="nav">
            <div><img className="holay-logo" src={holayLogo} alt="Holay"></img></div>
            <div className="made-by-me">Made by Mateo Penagos (<a href="https://steamcommunity.com/id/holay/" target="_blank" rel="noopener noreferrer">holay</a>). <span style={{marginLeft:'5px'}}>if you wish to donate, you can do so <a style={{textDecoration:'underline'}} href="https://www.paypal.me/holay63" target="_blank" rel="noopener noreferrer">here</a></span></div>
            <div className="controls-container">
                <div>
                    <input type="checkbox" id="packaging" name="packaging"
                        onChange={toggleBoosterPackaging} checked={boosterPackaging} />
                    <label htmlFor="packaging" className="toggle-label">Toggle Booster Packaging <i data-tip="warning" data-for='warning' className="fas fa-exclamation-triangle"></i></label>
                    <ReactTooltip id='warning' type='error' place="bottom">
                        <span>Warning: cards will only begin loading when taken out of the booster pack packaging</span>
                    </ReactTooltip>
                </div>
                <div>

                    <span>Booster pack count: </span>
                    <select className="pack-count-dropdown" value={packCount} onChange={handleChange}>
                        {numberArray.map(number => <option key={number} value={number}>{number}</option>)}
                    </select>
                </div>
            </div>
        </div>)

}

export default StickyNav;