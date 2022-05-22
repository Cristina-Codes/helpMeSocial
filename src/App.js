// Styling
import './App.css';
// Modules
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, push, remove, get, set } from 'firebase/database';
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
  const [ factResponse, setFactResponse ] = useState([]);
  const [ fact, setFact ] = useState('');
  const [ numOfFave, setNumOfFave ] = useState();


// Connecting with firebase onload
  useEffect(() => {
    const database = getDatabase(app);
    const faveRef = ref(database, '/Favorites');

    // Show total favorited facts
    onValue(faveRef, (response) => {
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
    const database = getDatabase(app);
    const factRef = ref(database, '/Facts');
    get(factRef).then((snapshot) => {
      setFactResponse(snapshot.val());
      displayAFact();
    })
    // Reset to false to allow another API call on next click
    setClicked(false);
  }, [clicked]);


  //Choosing a random fact by index from the response
  const displayAFact = () => {
    const randomIndex = (Math.floor(Math.random() * factResponse.length));
    setFact(factResponse[randomIndex]);
  }

  
// 'Favorite' a fact/push to Firebase when heart icon clicked
  const makeItFave = (currentFact) => {
    const database = getDatabase(app);
    const faveRef = ref(database, '/Favorites');
    push(faveRef, currentFact);
  }

// Pulling most updated favorites from Firebase when 'all favorites' clicked
  const grabAllFaves = () => {
    const database = getDatabase(app);
    const faveRef = ref(database, '/Favorites');

    get(faveRef).then((snapshot) => {
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
    // Add closing event
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
      const faveRef = ref(database, '/Favorites');
      set(faveRef, '');
      faveDisplay.remove();
    })
    // Accessible event
    deleteAll.addEventListener('keydown', (e) => {
      if(e.keyCode === 13) {
        const database = getDatabase(app);
        const faveRef = ref(database, '/Favorites');
        set(faveRef, '');
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
        const noLongerFaveRef = ref(database, `/Favorites/${obj.key}`);
        remove(noLongerFaveRef);
        faveDisplay.remove();
        // re-render the list of favorites if one is deleted
        grabAllFaves();
      })
      // Accessible event
      trashIt.addEventListener('keydown', (e) => {
        if(e.keyCode === 13){
          const database = getDatabase(app);
          const noLongerFaveRef = ref(database, `/Favorites/${obj.key}`);
          remove(noLongerFaveRef);
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