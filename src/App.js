import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { SetList } from "./components"
import { CARD_BACK_URI } from "./config"

function App() {
  const [cards, setCards] = useState({})
  const [packCount, setPackCount] = useState(12)
  const [draftPacks, setDraftPacks] = useState("")

  function updateShowcase(cards){
      const lands = cards.filter(card => card.rarity === "common" && card.type_line.includes('Basic Land'))
      const commons = cards.filter(card => card.rarity === "common" && !card.type_line.includes('Basic Land'));
      const uncommons = cards.filter(card => card.rarity === "uncommon");
      const rares = cards.filter(card => card.rarity === "rare");
      const mythics = cards.filter(card => card.rarity === "mythic");  
 
      setCards({ lands, commons, uncommons, rares, mythics })
  }

  useEffect(()=>{

    function makePack(){
      const pack = [];
      // 15 cards
      // basic land (or foil?)
      // 7/8 rare 1/8 mythic
      // 10 common
      // 3 uncommon
      for (let i = 0; i < 10; i++) {
        pack.push(cards.commons[Math.floor(Math.random() * cards.commons.length)])
      }
      for (let i = 0; i < 3; i++) {
        pack.push(cards.uncommons[Math.floor(Math.random() * cards.uncommons.length)])
      }
      if(Math.random() > 0.125){
        pack.push(cards.rares[Math.floor(Math.random() * cards.rares.length)])
      }else{
        pack.push(cards.mythics[Math.floor(Math.random() * cards.mythics.length)])
      }
      pack.push(cards.lands[Math.floor(Math.random()*cards.lands.length)])

      return pack
    }

    function generateCustomDeckObject(deckIndex, pack){
      const result = {}

      pack.forEach((card, cardIndex) => {
        result[`${1 + deckIndex}${cardIndex}`] = {
          FaceURL: card.image_uris.png,
          BackURL: CARD_BACK_URI,
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
          ContainedObjects: pack.map((card, cardIndex) => ({
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
            Nickname: card.name,
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
                FaceURL: card.image_uris.png,
                BackURL: CARD_BACK_URI,
                NumWidth: 1,
                NumHeight: 1,
                BackIsHidden: true,
                UniqueBack: false
              }
            },
            XmlUI: "",
            LuaScript: "",
            LuaScriptState: "",
          
          })
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
  
    // is an object and I wrote it to file as
    // json
    const fileName = "draft";
    const json = draftPacks
    const blob = new Blob([json], { type: 'application/json' });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <SetList onSearch={updateShowcase}/>
        {draftPacks && <button onClick={download}> Download for TTS </button>}
        {/* <Showcase />  */}
      </header>
    </div>
  );
}

export default App;
