import React, { useEffect, useState } from "react"
import { API_BASE_URL } from "../../config"



const SetList = ({ onSearch }) => {
    const [sets, setSets] = useState([]);
    const [chosenSetURI, setChosenSetURI] = useState("")
    const [cardsObject, setCards] = useState({ cards: [], hasMore: false});

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        // Update the document title using the browser API
        fetch(`${API_BASE_URL}/sets`)
            .then((response) => {
                return response.json();
            })
            .then(({ data }) => {
                const filteredData = data.filter(set => set.set_type === "expansion")
                setSets(filteredData)
            });
    }, []);

    useEffect(() => {
        if(cardsObject.nextPage){
            getDraftData(cardsObject.nextPage, true)
        }else{
            onSearch(cardsObject.cards)
        }
    }, [ cardsObject ])

    function handleChange(event) {
        setChosenSetURI(event.target.value)
    }
    function getDraftData(url = chosenSetURI, recursed = false) {
        const cleanedData = !recursed? [] : [...cardsObject.cards] ;

        fetch(url).then(response => response.json()).then(response => {
            setCards({cards: [...cleanedData, ...response.data], nextPage: response.next_page})
        })
    }

    return (
        <div>
            <select onChange={handleChange}>
                <option value="null">Choose a set</option>
                {sets.map((set, index) => <option key={index} value={set.search_uri}>{set.name}</option>)}
            </select>
            {chosenSetURI && <button onClick={() => { getDraftData() }}>Run draft</button>}
        </div>
    );
}

export default SetList;