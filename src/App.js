import React, { useState, useEffect } from 'react';
import './App.css';
import { SetList, Showcase, StickyNav, Footer } from "./components"
import { CARD_BACK_URI, TOKEN_CARD_BACK_URI, BOOSTER_ARTS } from "./config"

function App() {

  const backgroundImages = [
    'https://www.desktophut.com/wp-content/uploads/2018/10/mtg-core-2019.jpg',
    'https://external-preview.redd.it/jkg8pUW3tb-io-83uQU46VJLQlC92ZAvEpbPlUDU-co.jpg?auto=webp&s=822151ad423474960358232e132a9f91d2ccef60',
    'https://images8.alphacoders.com/943/943285.jpg',
    'https://wallpapercave.com/wp/wp4579177.jpg',
    "https://media.magic.wizards.com/images/wallpaper/regal-caracal_eld_2560x1600_wallpaper.jpg",
    'https://cdn.hipwallpaper.com/i/65/43/ibXTkY.jpg'
  ]

  const [cards, setCards] = useState({})
  const [packCount, setPackCount] = useState(12)
  const [draftPacks, setDraftPacks] = useState("")
  const [imageIndex, setImageIndex] = useState(Math.floor(Math.random()*backgroundImages.length))
  const [boosterPackaging, setBoosterPackaging] = useState(false);
  const [code, setCode] = useState('');

  function updateShowcase({ cards, tokens = [], promos = [], masterpieces = [] }) {
    const lands = cards.filter(card => card.rarity === "common" && card.type_line.includes('Land'))
    const commons = cards.filter(card => card.rarity === "common" && !card.type_line.includes('Land'));
    const uncommons = cards.filter(card => card.rarity === "uncommon");
    const rares = cards.filter(card => card.rarity === "rare");
    const mythics = cards.filter(card => card.rarity === "mythic");
    setCards({ tokens, promos, lands, commons, uncommons, rares, mythics, masterpieces})
    commons[0] && setCode(commons[0].set)
  }

  function toggleBoosterPackaging(event){
    setBoosterPackaging(!boosterPackaging)
  }

  useEffect(() => {

    function makePack() {
      const pack = [];
      // 16 cards
      // basic land, promo replacing foil, or masterpiece
      // 7/8 rare 1/8 mythic
      // 10 common
      // 3 uncommon
      // 1 token

      //doing this to deep clone and modify the cardData freely for each pack
      const cardData = JSON.parse(JSON.stringify(cards))

      if (cards.tokens.length > 0) {
        pack.push(cards.tokens[Math.floor(Math.random() * cards.tokens.length)])

      }
      if (Math.random() <= 0.0666 && cards.promos.length > 0) {
        // console.log('adding special card')
        if (Math.random() <= 0.15 && cards.masterpieces.length > 0) {
          // console.log('adding masterpiece')
          pack.push(cards.masterpieces[Math.floor(Math.random() * cards.masterpieces.length)])
        } else {
          // console.log('adding promo')
          pack.push(cards.promos[Math.floor(Math.random() * cards.promos.length)])
        }
      } else if (cardData.lands.length > 0) {
        // console.log('no special card added')
        pack.push(cardData.lands[Math.floor(Math.random() * cardData.lands.length)])
      }
      if (Math.random() > 0.125) {
        pack.push(cardData.rares[Math.floor(Math.random() * cardData.rares.length)])
      } else if (cardData.mythics.length > 0) {
        pack.push(cardData.mythics[Math.floor(Math.random() * cardData.mythics.length)])
      }
      for (let i = 0; i < 3; i++) {
        const index = Math.floor(Math.random() * cardData.uncommons.length)
        pack.push(cardData.uncommons[index])
        cardData.uncommons.splice(index, 1)
      }
      for (let i = 0; i < 10; i++) {
        const index = Math.floor(Math.random() * cardData.commons.length)
        pack.push(cardData.commons[index])
        cardData.commons.splice(index, 1)
      }



      return pack
    }

    function generateCustomDeckObject(deckIndex, pack) {
      const result = {}

      pack.forEach((card, cardIndex) => {

        const cardBack = card.set_type === "token" || card.layout === "emblem" ? TOKEN_CARD_BACK_URI : CARD_BACK_URI

        result[`${1 + deckIndex}${cardIndex}`] = {
          FaceURL: card.image_uris ? card.image_uris.png : card.card_faces[0].image_uris.png,
          BackURL: card.image_uris ? cardBack : card.card_faces[1].image_uris.png,
          NumWidth: 1,
          NumHeight: 1,
          BackIsHidden: true,
          UniqueBack: false
        }
      })
      return result
    }

    function generateTTSPacks(packs){
      const TTSPacks = packs.map((pack, deckIndex) => ({
        Name: "Deck",
        Transform: {
          posX: -4 * calculatePosition(deckIndex, 'X'),
          posY: 1,
          posZ: -4 * calculatePosition(deckIndex, "Z"),
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
        DeckIDs: pack.map((card, cardIndex) => Number(`${1 + deckIndex}${cardIndex}00`)),

        CustomDeck: generateCustomDeckObject(deckIndex, pack),
        XmlUI: "",
        LuaScript: "",
        LuaScriptState: "",
        ContainedObjects: pack.map((card, cardIndex) => {
          const cardBack = card.set_type === "token" || card.layout === "emblem" ? TOKEN_CARD_BACK_URI : CARD_BACK_URI
          let cardName = card.name
          if (card.set_type === "promo") {
            cardName += " - Promo";
          }
          if (card.set_type === "masterpiece") {
            cardName += " - Masterpiece";
          }
          return ({
            Name: "CardCustom",
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
            Description: `$${card.prices.usd || card.prices.usd_foil || 0}`,
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
            CustomDeck: {
              [`${1 + deckIndex}${cardIndex}`]: {
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

          })
        }
        )

      }))
      if(boosterPackaging){
        return TTSPacks.map((pack, index)=>(
          {
            Name: 'Custom_Model_Bag',
            Transform: {
              posX: -6 * calculatePosition(index, 'X'),
              posY: 1,
              posZ: -6 * calculatePosition(index, "Z"),
              rotX: 0,
              rotY: 180,
              rotZ: 0,
              scaleX: 1,
              scaleY: 1,
              scaleZ: 1,
            },
            Nickname: "",
            Description: "",
            GMNotes: "",
            ColorDiffuse: {
              r: 1.0,
              g: 1.0,
              b: 1.0
            },
            Locked: false,
            Grid: true,
            Snap: true,
            IgnoreFoW: false,
            Autoraise: true,
            Sticky: true,
            Tooltip: true,
            GridProjection: false,
            HideWhenFaceDown: false,
            Hands: false,
            MaterialIndex: -1,
            MeshIndex: -1,
            CustomMesh: {
              MeshURL: 'http://pastebin.com/raw/PqfGKtKR',
              DiffuseURL: BOOSTER_ARTS[code]? BOOSTER_ARTS[code][Math.floor(Math.random() * BOOSTER_ARTS[code].length)] : BOOSTER_ARTS['default'][0],
              NormalURL: 'http://i.imgur.com/pEN77ux.png',
              ColliderURL: "",
              Convex: true,
              MaterialIndex: 0,
              TypeIndex: 6,
              CastShadows: true
            },
            XmlUI: "",
            LuaScript: "",
            LuaScriptState: "",
            ContainedObjects: [pack],
            GUID: 'ae1ee7'
          }
        ))
      }else{
        return TTSPacks   
      }
    }

    function formatForTTS(packs) {
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
        ObjectStates: generateTTSPacks(packs)
      }

      return formattedPacks;

    }

    if (cards.commons && cards.commons.length > 0) {
      const packs = []
      for (let i = 0; i < packCount; i++) {
        packs.push(makePack())
      }




      setDraftPacks(JSON.stringify(formatForTTS(packs)))
    }

  }, [cards])

  useEffect(() => {

  }, [draftPacks])

  function updatePackCount(newCount) {
    setPackCount(newCount)
  }

  function calculatePosition(index, coordinate) {
    if (coordinate === 'X') {
      return index % 6
    }
    if (coordinate === 'Z') {
      return Math.floor(index / 6)
    }
  }

  async function download() {
    const setName = cards.commons[0].set_name;
    const fileName = `${setName} booster packs`;
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
      <StickyNav packCount={packCount} updatePackCount={updatePackCount} toggleBoosterPackaging={toggleBoosterPackaging} boosterPackaging={boosterPackaging}/>
      <header className="App-header">

        <div className="cover-image" style={{backgroundImage: `url(${backgroundImages[imageIndex]})`}}>
          <h1 className="header-text">Magic the gathering</h1>
          <p className="welcome-text">
            Booster pack generator for <a className="tabletop-link" href="https://www.tabletopsimulator.com/" target="_blank" rel="noopener noreferrer">tabletop simulator</a>
          </p>
        <div className="controls">

          <SetList onSearch={updateShowcase} />
          {draftPacks && <button className="download-button" onClick={download}> Download </button>}
        </div>
        </div>
        {draftPacks && <p className="showcase-intro">
          Here is what you can expect to find in these packs:
        </p>}
        <Showcase cards={cards} />
      </header>
      <Footer>
        <span>This booster pack generator is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC</span>
      </Footer>
    </div>
  );
}

export default App;
