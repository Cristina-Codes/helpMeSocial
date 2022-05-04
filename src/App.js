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
    const database = getDatabase(app);
    const dbRef = ref(database);

    // Show total favorited facts
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

  // When 'Bring on the Facts!' is clicked
  const nowClicked = (e) => {
    e.preventDefault();
    // True to make useEffect run API call
    setClicked(true);
    // Now show the fact display bubble
    setDisplayBubble(true);
    // Hide any previous pop up message
    const popUpContainer = document.querySelector('.popUpContainer');
    popUpContainer.innerHTML = '';
  }

// Making the API call, reset clicked to false for next API call
  useEffect(() => {
    if(clicked === true) {
      axios({
        url: 'https://api.aakhilv.me/fun/facts',
        dataResponse: 'json'
      }).then(response => {
        const funFact = response.data[0];
        setFact(funFact);
      }).catch((err) => {
        alert('Yikes! Looks like we\'ve run out of facts...we\'ll head out for more. Check back later!', err);
      })
    }
    // Reset to false to allow another API call on next click
    setClicked(false);
  }, [clicked]);
  
// Favorite a fact/push to Firebase when heart icon clicked
  const makeItFave = (currentFact) => {
    const database = getDatabase(app);
    const dbRef = ref(database);

    push(dbRef, currentFact);
  }

// Pulling most updated favorites from Firebase when 'all favorites' clicked
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

// Displaying all favorites pulled from Firebase
  const displayTheFaves = (array) => {
    // Create and query needed elements
    const faveDisplay = document.createElement('div');
    const theRoot = document.querySelector('#root');
    const closeIt = document.createElement('div');
    const deleteAll = document.createElement('div');
    // X for closing all favorites display
    closeIt.innerText = 'X';
    closeIt.classList.add('xIconContainer');
    closeIt.setAttribute('tabIndex', '0');
    closeIt.setAttribute('alt', 'Icon to close the all favorites list');
    closeIt.addEventListener('click', () => {
      faveDisplay.remove();
    })
    // Accessible event
    closeIt.addEventListener('keydown', (e) => {
      if(e.keyCode === 13){
        faveDisplay.remove();
      }
    })

    // Delete all facts option
    deleteAll.innerText = 'Start fresh - delete them all!';
    deleteAll.classList.add('deleteAll');
    deleteAll.setAttribute('tabIndex', '0');
    deleteAll.addEventListener('click', () => {
      const database = getDatabase(app);
      const dbRef = ref(database);
      remove(dbRef);
      faveDisplay.remove();
    })
    // Accessible event
    deleteAll.addEventListener('keydown', (e) => {
      if(e.keyCode === 13) {
        const database = getDatabase(app);
        const dbRef = ref(database);
        remove(dbRef);
        faveDisplay.remove();
      }
    })

    faveDisplay.appendChild(closeIt);
    
    // Add delete option for each fact
    array.forEach((obj) => {
      const stringDiv = document.createElement('div');
      const aString = document.createElement('p');
      const trashIt = document.createElement('div');

      aString.innerText = `${obj.name}`;
      trashIt.innerHTML = '🗑'; // fontAwesome appears as object object - revisit
      trashIt.classList.add('trashIcon');
      trashIt.setAttribute('tabIndex', '0');
      trashIt.setAttribute('alt', 'Icon to remove this fact from favorites');

      // Event to unfavorite/remove from Firebase
      trashIt.addEventListener('click', () => {
        const database = getDatabase(app);
        const dbRef = ref(database, `/${obj.key}`);
        remove(dbRef);
        faveDisplay.remove();
        // re-render the list of favorites if one is deleted
        grabAllFaves();
      })
      // Accessible event
      trashIt.addEventListener('keydown', (e) => {
        if(e.keyCode === 13){
          const database = getDatabase(app);
          const dbRef = ref(database, `/${obj.key}`);
          remove(dbRef);
          faveDisplay.remove();
          // re-render the list of favorites if one is deleted
          grabAllFaves();
        }
      })
      
      stringDiv.classList.add('faveDiv');
      stringDiv.appendChild(aString);
      stringDiv.appendChild(trashIt);
      faveDisplay.appendChild(stringDiv);
      faveDisplay.appendChild(deleteAll);
    })
    
    // Display the list of favorites
    faveDisplay.classList.add('faveDisplay');
    theRoot.appendChild(faveDisplay);
  }

// Fixing display of total favorites when double digits
  const stylingFix = (count) => {
    const numOfFave = document.querySelector('.numOfFaves');
    if(count > 9){
      numOfFave.classList.add('twoDigits');
    }else{
      numOfFave.classList.remove('twoDigits');
    }
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