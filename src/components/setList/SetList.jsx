import React, { useEffect, useState } from "react"
import { API_BASE_URL } from "../../config"



const SetList = ({ onSearch }) => {
    const [sets, setSets] = useState([]);
    const [chosenSet, setChosenSet] = useState("")
    const [chosenSetTokens, setChosenSetTokens]= useState([])
    const [cardsObject, setCards] = useState({ cards: [], hasMore: false});
    const [tokens, setTokens] = useState([])

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        // Update the document title using the browser API
        fetch(`${API_BASE_URL}/sets`)
            .then((response) => {
                return response.json();
            })
            .then(({ data }) => {
                const filteredData = data.filter(set => set.set_type === "expansion" || set.set_type === "core" || set.set_type === "masters")
                const tokens = data.filter(set => set.set_type === "token")
                filteredData.sort((setA, setB)=>{
                    if (setA.name === setB.name) return 0;
                    return setA.name > setB.name? 1:-1;
                })
                setSets(filteredData);
                setTokens(tokens);
            });
    }, []);

    useEffect(() => {
        if(cardsObject.nextPage){
            getDraftData(cardsObject.nextPage, true)
        }else{
            onSearch({cards: cardsObject.cards, tokens: chosenSetTokens})
        }
    }, [ cardsObject ])

    function handleChange(event) {
        setChosenSet(event.target.value)
    }
    function getDraftData(url = chosenSet, recursed = false) {
        
        const cleanedData = !recursed? [] : [...cardsObject.cards] ;
        if(!recursed){
            fetchTokens()
        }
        fetch(url).then(response => response.json()).then(response => {
            setCards({cards: [...cleanedData, ...response.data], nextPage: response.next_page})
        }).catch(error=>console.log(error))
    }
    function fetchTokens(){
        const chosenSetCode = sets.find(set => set.search_uri === chosenSet).code
        const setTokens = tokens.find(tokenSet => tokenSet.parent_set_code === chosenSetCode)
        if(setTokens){

            fetch(setTokens.search_uri).then(response => response.json()).then(response => {
                setChosenSetTokens(response.data)
            })
        }
    }

    return (
        <div>
            <select onChange={handleChange}>
                <option value="null">Choose a set</option>
                {sets.map((set, index) => <option key={index} value={set.search_uri}>{set.name}</option>)}
            </select>
            {chosenSet && <button onClick={() => { getDraftData() }}>Run draft</button>}
        </div>
    );
}

export default SetList;