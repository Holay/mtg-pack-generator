import React, {useState, useEffect} from 'react';
import logo from './mtg-logo.png';
import './App.css';
import { SetList, Showcase} from "./components"
import { CARD_BACK_URI, TOKEN_CARD_BACK_URI } from "./config"

function App() {
  const [cards, setCards] = useState({})
  const [packCount, setPackCount] = useState(12)
  const [draftPacks, setDraftPacks] = useState("")

  function updateShowcase({cards, tokens=[], promos=[], masterpieces=[]}){
      const lands = cards.filter(card => card.rarity === "common" && card.type_line.includes('Land'))
      const commons = cards.filter(card => card.rarity === "common" && !card.type_line.includes('Land'));
      const uncommons = cards.filter(card => card.rarity === "uncommon");
      const rares = cards.filter(card => card.rarity === "rare");
      const mythics = cards.filter(card => card.rarity === "mythic");  
    setCards({ tokens, promos,lands, commons, uncommons, rares, mythics, masterpieces })
  }

  useEffect(()=>{

    function makePack(){
      const pack = [];
      // 16 cards
      // basic land, promo replacing foil, or masterpiece
      // 7/8 rare 1/8 mythic
      // 10 common
      // 3 uncommon
      // 1 token

      //doing this to deep clone and modify the cardData freely for each pack
      const cardData = JSON.parse(JSON.stringify(cards))


      for (let i = 0; i < 10; i++) {
        const index = Math.floor(Math.random() * cardData.commons.length)
        pack.push(cardData.commons[index])
        cardData.commons.splice(index,1)
      }
      for (let i = 0; i < 3; i++) {
        const index = Math.floor(Math.random() * cardData.uncommons.length)
        pack.push(cardData.uncommons[index])
        cardData.uncommons.splice(index,1)
      }
      if(Math.random() > 0.125){
        pack.push(cardData.rares[Math.floor(Math.random() * cardData.rares.length)])
      }else if(cardData.mythics.length>0){
        pack.push(cardData.mythics[Math.floor(Math.random() * cardData.mythics.length)])
      }
      if(Math.random()<=0.0666){
        // console.log('adding special card')
        if(Math.random() <= 0.15 && cards.masterpieces.length>0){
          // console.log('adding masterpiece')
          pack.push(cards.masterpieces[Math.floor(Math.random() * cards.masterpieces.length)])
        }else if(cards.promos.length > 0){
          // console.log('adding promo')
          pack.push(cards.promos[Math.floor(Math.random() * cards.promos.length)])
        }
      }else if(cardData.lands.length >0){
        // console.log('no special card added')
        pack.push(cardData.lands[Math.floor(Math.random()*cardData.lands.length)])
      }
      if (cards.tokens.length > 0) {
        pack.push(cards.tokens[Math.floor(Math.random() * cards.tokens.length)])
      }

      return pack
    }

    function generateCustomDeckObject(deckIndex, pack){
      const result = {}

      pack.forEach((card, cardIndex) => {
        
        const cardBack = card.set_type === "token" || card.layout === "emblem" ? TOKEN_CARD_BACK_URI:CARD_BACK_URI
        
        result[`${1 + deckIndex}${cardIndex}`] = {
          FaceURL: card.image_uris? card.image_uris.png: card.card_faces[0].image_uris.png,
          BackURL: card.image_uris ? cardBack : card.card_faces[1].image_uris.png,
          NumWidth: 1,
          NumHeight: 1,
          BackIsHidden: true,
          UniqueBack: false
        }
      })
      return result
    }

    function formatForTTS(packs){
      const formattedPacks = {
        SaveName: "",
        GameMode: "",
        Gravity: 0.5,
        PlayArea: 0.5,
        Date: "",
        Table: "",
        Sky: "",
        Note: "",
        Rules: "",
        XmlUI: "",
        LuaScript: "",
        LuaScriptState: "",
        ObjectStates: packs.map((pack, deckIndex) => ({
          Name: "Deck",
          Transform: {
            posX: -4*deckIndex,
            posY: 1,
            posZ: 1,
            rotX: 0,
            rotY: 180,
            rotZ: 180,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
          },
          Nickname: "",
          Description: "",
          GMNotes: "",
          ColorDiffuse: {
            r: 0.713235259,
            g: 0.713235259,
            b: 0.713235259
          },
          Locked: false,
          Grid: true,
          Snap: true,
          IgnoreFoW: false,
          Autoraise: true,
          Sticky: true,
          Tooltip: true,
          GridProjection: false,
          HideWhenFaceDown: true,
          Hands: false,
          SidewaysCard: false,
          DeckIDs:pack.map((card,cardIndex) => Number(`${1+deckIndex}${cardIndex}00`)),

          CustomDeck: generateCustomDeckObject(deckIndex, pack),
          XmlUI: "",
          LuaScript: "",
          LuaScriptState: "",
          ContainedObjects: pack.map((card, cardIndex) => {
            const cardBack = card.set_type === "token" || card.layout === "emblem"  ? TOKEN_CARD_BACK_URI : CARD_BACK_URI
            let cardName = card.name
            if(card.set_type === "promo"){
              cardName+= " - Promo";
            }
            if (card.set_type === "masterpiece") {
              cardName += " - Masterpiece";
            }
            return ({
            Name:"CardCustom",
            Transform: {
              posX: 0,
              posY: 0,
              posZ: 0,
              rotX: 0,
              rotY: 180,
              rotZ: 180,
              scaleX: 1,
              scaleY: 1,
              scaleZ: 1,
            },
            Nickname: cardName,
            Description: "",
            GMNotes: "",
            ColorDiffuse: {
              r: 0.713235259,
              g: 0.713235259,
              b: 0.713235259
            },
            Locked: false,
            Grid: true,
            Snap: true,
            IgnoreFoW: false,
            Autoraise: true,
            Sticky: true,
            Tooltip: true,
            GridProjection: false,
            HideWhenFaceDown: true,
            Hands: true,
            SidewaysCard: false,
            CardID: Number(`${1 + deckIndex}${cardIndex}00`),
            CustomDeck:{
              [`${1 + deckIndex}${cardIndex}`]:{
                FaceURL: card.image_uris ? card.image_uris.png : card.card_faces[0].image_uris.png,
                BackURL: card.image_uris ? cardBack : card.card_faces[1].image_uris.png,
                NumWidth: 1,
                NumHeight: 1,
                BackIsHidden: true,
                UniqueBack: false
              }
            },
            XmlUI: "",
            LuaScript: "",
            LuaScriptState: "",
          
          })}
          )

        }))
      }

      return formattedPacks;

    }
    
    if(cards.commons && cards.commons.length > 0){
      const packs = []
      for (let i = 0; i < packCount; i++) {
        packs.push(makePack())
      }
      
      


      setDraftPacks(JSON.stringify(formatForTTS(packs)))
    }

  }, [cards])

  useEffect(()=>{

  },[draftPacks])

  async function download() {
    const setName = cards.commons[0].set_name;
    const fileName = `${setName} draft`;
    const json = draftPacks
    const blob = new Blob([json], { type: 'application/json' });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setCards({})
    setDraftPacks("")
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="welcome-text">
          Booster pack generator for tabletop simulator
        </p>
        <div className="controls">

        <SetList onSearch={updateShowcase}/>
        {draftPacks && <button class="download-button" onClick={download}> Download </button>}
        </div>
        {draftPacks && <p className="showcase-intro">
          Here is what you can expect to find in these packs: 
        </p>}
        <Showcase cards={cards} /> 
      </header>
    </div>
  );
}

export default App;
