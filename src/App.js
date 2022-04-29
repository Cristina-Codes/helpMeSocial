// Create state items 
// - response value ''
                                        // - favorite or not []

// Once the request type is submitted
                                        // Show error nothing returns/api down
  // If successful 
    // Update random fact state (default empty string)

// Render the results
  // random fact div appears 
  // heart icon appears
                                        // if heart icon tapped
                                          // fact value added to firebase
                                        // if tapped again
                                          // fact value removed from firebase

// Styling
import './App.css';
// Modules
import axios from 'axios';
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, push, remove, get } from 'firebase/database';
// Config
import app from './firebase';
// Components
import Header from './Components/Header';
import Intro from './Components/Intro';
import FunFact from './Components/FunFact';
import Footer from './Components/Footer';


function App() {
  // set States
  const [ clicked, setClicked ] = useState(false);
  const [ fact, setFact ] = useState('');
  const [ faveFacts, setFaveFacts ] = useState([]);

  useEffect(() => {
    // hold the database
    const database = getDatabase(app);
    // refer to the database
    const dbRef = ref(database);

    onValue(dbRef, (response) => {
        const faveArray = [];
        const data = response.val();
        
        for(let key in data) {
          faveArray.push(data[key])
        }
        setFaveFacts(faveArray);
      })
    //showNumOfFavorites(savedFaves); // won't update with [] at end
  }, [])

  useEffect(() => {
    if(clicked === true) {
      axios({
        url: 'https://api.aakhilv.me/fun/facts',
        method: 'GET',
        dataResponse: 'json'
      }).then(response => {
        const funFact = response.data[0];
        setFact(funFact);
      })
    }
    setClicked(false);
  }, [clicked]);

  const nowClicked = (e) => {
    e.preventDefault();
    setClicked(true)
  }

  const makeItFave = (currentFact) => {
    const database = getDatabase(app);
    const dbRef = ref(database);

    push(dbRef, currentFact);
  }

  const showAllFaves = () => {
    const database = getDatabase(app);
    const dbRef = ref(database);

    get(dbRef).then((snapshot) => {
      const allFaves = snapshot.val();
      const allFavesStrings = [];
      for(let key in allFaves){
        allFavesStrings.push(allFaves[key]);
      }
    })
  }
  // the above gives me the object with keys and fact strings. I need these to render to the page, probably via FunFact. I believe it will be a ternary - but what is the thing to check first???

  // nextStepFunction would pull out just the strings and create a new array to pass through FunFact...but how to do that????

  // actually, I think creating the new array in showAllFaves makes way more sense, but can it be done?? 

  // allFaves is an object...need to recall how we played with that before. Esther taught us and we changed an Object to an array to then use map, reduce, etc on

  return (
    <div className='App'>
      <Header showTheFaves={showAllFaves}/>
      <Intro nowClicked={nowClicked}/>
      <FunFact theFact={fact} loveIt={makeItFave}/>
      <Footer />
    </div>
  );
}

export default App;

// with stretch goals included
// Create state items 
// - user request type (would you rather/random fact) ''
// - response value ''
// - favorite or not []

// on page load
  // render header
    // introduction: Forgotten how to social? Make it more awkward by dropping random facts and 'would you rathers' into the convo
    // 'make your choice' dropdown: WYR or random fact
    // submit button
    // heart icon for favorites
      // when clicked, favorites appear listed on the page, sorted as WYR and random facts

// Once the request type is submitted
  // Show error nothing returns/api down
  // If successful 
    // Update WYR state (default empty string)
    // OR
    // Update random fact state (default empty string)

// Render the results
  // fact/WYR div appears 
  // heart icon appears
    // if heart icon tapped
      // value added to favorite array
    // if tapped again
      // value removed from favorite array