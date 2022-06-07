// Modules
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, push, get } from 'firebase/database';
// Components
import Header from './Header';
import Intro from './Intro';
import FunFact from './FunFact';
import Footer from './Footer';
// Config
import app from '../firebase';


const Home = () => {
  // set States
  const [ displayBubble, setDisplayBubble ] = useState(false);
  const [ factResponse, setFactResponse ] = useState([]);
  const [ fact, setFact ] = useState('');
  const [ numOfFave, setNumOfFave ] = useState();

// Connecting with firebase onload
  useEffect(() => {
    const database = getDatabase(app);
    const faveRef = ref(database, '/Favorites');
    const factRef = ref(database, '/Facts');
    
    // Get all the facts to display, set in state
    get(factRef).then((snapshot) => {
      setFactResponse(snapshot.val());
    })

    // Set total fave facts and their strings
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
    // Now show the fact display bubble
    setDisplayBubble(true);
    // Hide any previous pop up message
    const popUpContainer = document.querySelector('.popUpContainer');
    popUpContainer.innerHTML = '';

    displayAFact();
  }


// Choosing a random fact by index from the response
  const displayAFact = () => {
    const randomIndex = (Math.floor(Math.random() * factResponse.length));
    setFact(factResponse[randomIndex]);
  }

// 'Favorite' a fact/push to Firebase when heart icon clicked
  const loveIt = (currentFact) => {
    const database = getDatabase(app);
    const faveRef = ref(database, '/Favorites');
    push(faveRef, currentFact);
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
      <>
        <header>
          <Header numOfFave={numOfFave}/>
          <Intro nowClicked={nowClicked}/>
        </header>
        {
          displayBubble ? <FunFact theFact={fact} loveIt={loveIt} /> : null
        }
        <div className='popUpContainer'></div>
        <Footer />
  
      </>
    );
  }

  export default Home;