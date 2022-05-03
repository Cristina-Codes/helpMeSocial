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
  const [ numOfFave, setNumOfFave ] = useState();


// Connecting with firebase onload
  useEffect(() => {
    // hold the database
    const database = getDatabase(app);
    // refer to the database
    const dbRef = ref(database);

    onValue(dbRef, (response) => {
        let faveCount = 0;
        const data = response.val();
        for(let key in data) {
          faveCount++;
        }
        setNumOfFave(faveCount);
        stylingFix(faveCount);
      })
  }, [])

  const stylingFix = (count) => {
    const numOfFave = document.querySelector('.numOfFaves');
    if(count > 9){
      numOfFave.classList.add('twoDigits');
    }else{
      numOfFave.classList.remove('twoDigits');
    }
  }

// Making the API call when 'Bring on the Facts!' is clicked
  useEffect(() => {
    if(clicked === true) {
      axios({
        url: 'https://api.aakhilv.me/fun/facts',
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
    setClicked(true);
    setDisplayBubble(true);
    const popUpContainer = document.querySelector('.popUpContainer');
    popUpContainer.innerHTML = '';
  }
  
  // Fact can be made a favorite/pushed to Firebase when heart icon clicked
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
    closeIt.addEventListener('click', () => {
      faveDisplay.remove();
    })
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
        faveDisplay.remove();
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
  }

  return (
    <div className='App'>
      <header>
        <Header grabTheFaves={grabAllFaves} showNumOfFave={numOfFave}/>
        <Intro nowClicked={nowClicked}/>
      </header>
      {
        displayBubble ? <FunFact theFact={fact} loveIt={makeItFave} /> : null
      }
      <div className='popUpContainer'></div>
      <Footer />
    </div>
  );
}

export default App;