import React, { useEffect, useState } from "react"
import { API_BASE_URL } from "../../config"



const SetList = ({ onSearch }) => {
    const [sets, setSets] = useState([]);
    const [chosenSet, setChosenSet] = useState("")
    const [chosenSetSpecial, setChosenSetSpecial] = useState({tokens: [], promos: [], masterpieces: []})
    const [cardsObject, setCards] = useState({ cards: [], hasMore: false});
    const [tokens, setTokens] = useState([])
    const [specialCards, setSpecialCards] = useState([])
    const allowedSetTypes = ['core', 'expansion', 'masters', 'draft_innovation', 'commander']


    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        // Update the document title using the browser API
        fetch(`${API_BASE_URL}/sets`)
            .then((response) => {
                return response.json();
            })
            .then(({ data }) => {
                const specialCards = data.filter(set => (set.set_type === "masterpiece" && set.parent_set_code) || (set.set_type === "promo" && set.parent_set_code))
                // console.log(data.filter(set => set.set_type === "promo" && set.parent_set_code))
                const filteredData = data.filter(set => allowedSetTypes.includes(set.set_type))
                const tokens = data.filter(set => set.set_type === "token")
                filteredData.sort((setA, setB)=>{
                    if (setA.name === setB.name) return 0;
                    return setA.name > setB.name? 1:-1;
                })
                setSpecialCards(specialCards)
                setSets(filteredData);
                setTokens(tokens);
            });
    }, []);

    useEffect(() => {
        if(cardsObject.nextPage){
            getDraftData(cardsObject.nextPage, true)
        }else{
            onSearch({ cards: cardsObject.cards, tokens: chosenSetSpecial.tokens, promos: chosenSetSpecial.promos, masterpieces: chosenSetSpecial.masterpieces})
        }
    }, [ cardsObject ])

    function handleChange(event) {
        setChosenSet(event.target.value)
    }
    async function getDraftData(url = chosenSet, recursed = false) {
        
        const cleanedData = !recursed? [] : [...cardsObject.cards] ;
        if(!recursed){
            await fetchSpecials()
        }
        fetch(url).then(response => response.json()).then(response => {
            setCards({cards: [...cleanedData, ...response.data], nextPage: response.next_page})
        }).catch(error=>console.log(error))
    }
    async function fetchSpecials(){
        const chosenSetCode = sets.find(set => set.search_uri === chosenSet).code
        const setTokens = tokens.find(tokenSet => tokenSet.parent_set_code === chosenSetCode)
        const setPromo = specialCards.find(specialSet => specialSet.parent_set_code === chosenSetCode && specialSet.set_type === "promo")
        const setMasterpiece = specialCards.find(specialSet => specialSet.parent_set_code === chosenSetCode && specialSet.set_type === "masterpiece")

        const result = {
            tokens: setTokens && await fetch(setTokens.search_uri).then(response => response.json()).then(response => {
                return response.data
            }),
            promos: setPromo && await fetch(setPromo.search_uri).then(response => response.json()).then(response => {
                return response.data
            }),
            masterpieces: setMasterpiece && await fetch(setMasterpiece.search_uri).then(response => response.json()).then(response => {
                return response.data
            })
        }
        setChosenSetSpecial({tokens: result.tokens, promos: result.promos, masterpieces: result.masterpieces})

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