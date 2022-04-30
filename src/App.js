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
                                              // display updates with deletion

                                              // X icon closes the favorites list display

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
  const [ displayBubble, setDisplayBubble ] = useState(false);
  const [ fact, setFact ] = useState('');
  const [ faveFacts, setFaveFacts ] = useState([]);


// Connecting with firebase onload
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

// Making the API call when 'Bring on the Facts!' is clicked
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

// Fact can be made a favorite/pushed to Firebase when unfilled heart icon clicked
  const nowClicked = (e) => {
    e.preventDefault();
    setClicked(true);
    setDisplayBubble(true);
  }
  const makeItFave = (currentFact) => {
    const database = getDatabase(app);
    const dbRef = ref(database);

    push(dbRef, currentFact);
  }

// Pulling most updated favorites from Firebase when heart icon in header clicked
  const grabAllFaves = () => {
    const database = getDatabase(app);
    const dbRef = ref(database);

    get(dbRef).then((snapshot) => {
      const allFaves = snapshot.val();
      const allFavesStrings = [];
      for(let key in allFaves){
        allFavesStrings.push({key: key, name: allFaves[key]});
      }

      displayTheFaves(allFavesStrings);
    })
  }

// Displaying the favorites pulled from Firebase
// Could change this to routing in future
  const displayTheFaves = (array) => {
    const faveDisplay = document.createElement('div');
    const theRoot = document.querySelector('#root');
  //add x to close favorites list
    const closeIt = document.createElement('div');
    closeIt.innerText = 'X';
    closeIt.classList.add('xIconContainer');
    faveDisplay.appendChild(closeIt);
    
    array.forEach((obj) => {
      const stringDiv = document.createElement('div');
      const aString = document.createElement('p');
      const trashIt = document.createElement('div');

      aString.innerText = `${obj.name}`;
      trashIt.innerHTML = '🗑'; // fontAwesome appears as object object - revisit
      trashIt.classList.add('trashIcon');

      // allow facts to be deleted from favorites/firebase
      trashIt.addEventListener('click', () => {
        const database = getDatabase(app);
        const dbRef = ref(database, `/${obj.key}`);
        remove(dbRef);
        // re-render the list of faves
        grabAllFaves();
      })
      
      stringDiv.classList.add('faveDiv');
      stringDiv.appendChild(aString);
      stringDiv.appendChild(trashIt);
      faveDisplay.appendChild(stringDiv);
    })
    
    // display the list of favorite facts
    faveDisplay.classList.add('faveDisplay');
    theRoot.appendChild(faveDisplay);
    closeTheFaves();
  }

  // add closing event
  const closeTheFaves = () => {
    const theX = document.querySelector('.xIconContainer');
    theX.addEventListener('click', () => {
      console.log('it\'s making a brand new faveDisplay on second click - leaving one hidden and the new without an event listener. I cannot use z-index based on earlier styling to fill vh as desired.');
    })
  }

  return (
    <div className='App'>
      <header>
        <Header grabTheFaves={grabAllFaves}/>
        <Intro nowClicked={nowClicked}/>
      </header>
      {
        displayBubble ? <FunFact theFact={fact} loveIt={makeItFave}/> : null
      }
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