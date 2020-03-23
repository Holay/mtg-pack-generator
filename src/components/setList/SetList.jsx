import React, { useEffect, useState } from "react"
import { API_BASE_URL } from "../../config"
import "./SetList.scss"

const selectStyle ={
    margin: '20px 90px 0',
    fontSize: '27px',
    borderRadius: '20px',
    fontFamily: 'Open Sans',
}


const SetList = ({ onSearch }) => {
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chosenSet, setChosenSet] = useState("")
    const [chosenSetSpecial, setChosenSetSpecial] = useState({tokens: [], promos: [], masterpieces: []})
    const [cardsObject, setCards] = useState({ cards: [], hasMore: false});
    const [tokens, setTokens] = useState([])
    const [specialCards, setSpecialCards] = useState([])
    const allowedSetTypes = ['core', 'expansion', 'masters', 'draft_innovation'];
    const allowedSpecialSets = ['mb1'];
    const removedFromList = ['fmb1'];


    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        // Update the document title using the browser API
        fetch(`${API_BASE_URL}/sets`)
            .then((response) => {
                return response.json();
            })
            .then(({ data }) => {
                const specialCards = data.filter(set => (set.set_type === "masterpiece") || (set.set_type === "promo" && set.parent_set_code) || removedFromList.includes(set.code))
                const filteredData = data.filter(set => ((allowedSetTypes.includes(set.set_type) || allowedSpecialSets.includes(set.code)) && !removedFromList.includes(set.code)))
                // code checking
                // console.log(filteredData.map(set=>({name:set.name, code: set.code})).sort((A,B) => {
                //     if(A.name > B.name){
                //         return 1
                //     }
                //     else if (A.name<B.name){
                //         return -1
                //     }
                //     return 0
                // }))

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
            setLoading(false)
            onSearch({ cards: cardsObject.cards, tokens: chosenSetSpecial.tokens, promos: chosenSetSpecial.promos, masterpieces: chosenSetSpecial.masterpieces})
        }
    }, [ cardsObject ])

    function handleChange(event) {
        setChosenSet(event.target.value)
    }
    async function getDraftData(url = chosenSet, recursed = false) {
        setLoading(true)
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
        let setPromo = specialCards.find(specialSet => specialSet.parent_set_code === chosenSetCode && specialSet.set_type === "promo")
        let setMasterpiece = specialCards.find(specialSet => specialSet.parent_set_code === chosenSetCode && specialSet.set_type === "masterpiece")
        //Special case for guild of ravnica mythic edition which does not have a parent_set_code
        if (chosenSetCode === "grn"){
            setMasterpiece = specialCards.find(specialSet => specialSet.code === "med")
        }
        //Special case for mystery booster foils which are separated into another set
        if (chosenSetCode === "mb1"){
            setPromo = specialCards.find(specialSet => specialSet.code === "fmb1")
        }
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
            <select style={selectStyle} onChange={handleChange}>
                <option value="null">Choose a set</option>
                {sets.map((set, index) => <option className="set-select-option" key={index} value={set.search_uri}>{set.name}</option>)}
            </select>

            {chosenSet && <button className={`run-draft-button ${loading ? "loading":"normal"}`}  onClick={() => { getDraftData() }}></button>}
        </div>
    );
}

export default SetList;