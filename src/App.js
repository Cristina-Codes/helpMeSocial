// Styling
import './App.css';
// Modules
import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Routes, Route } from 'react-router-dom';
// Config
import app from './firebase';
// Components
import AllFavesList from './Components/AllFavesList';
import Home from './Components/Home';

const App = () => {
  const [ everyFavorite, setEveryFavorite ] = useState();

  // Connecting with firebase onload
  useEffect(() => {
    const database = getDatabase(app);
    const faveRef = ref(database, '/Favorites');

    // Set total fave facts and their strings
    onValue(faveRef, (response) => {
        const data = response.val();
        const everyFaveStrings = [];
        for(let key in data) {
          everyFaveStrings.push({key: key, string: data[key]});
        }
        setEveryFavorite(everyFaveStrings);
      })
  }, [])

  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<AllFavesList everyFavorite={everyFavorite}/>} />
      </Routes>
    </div>
  )
}

export default App;