import app from '../firebase';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrashCan } from '@fortawesome/free-regular-svg-icons';

const FunFact = ({ theFact, loveIt }) => {
  // Set state for 'favorite'
  const [ favorite, setFavorite ] = useState(false);

  // Function to show app message randomly
  const showPopUp = () => {
    // Random chance to determine if app should show message
    const randomChance = (Math.floor(Math.random() * 100));
    console.log(randomChance)

    // Messages array
    const encouragementArray = ['Not awkward at all!', 'Totally normal to share that', 'Why not say it now?', 'Epic', '💛 Everyone will love that 💛', 'We all clearly need this knowledge', 'Useless? I think not!', 'Now the conversation is heating up 🔥', 'That\'s 🔥🔥🔥', 'Erm...maybe that\'s a bit too odd', 'On second thought...🫣', 'Say it...say it now 😈', 'You\'ll be using that in every conversation 💬', 'Practice on the barista? I think so!', 'You\'ll get so many dates with that one', 'The fun begins with that fact!'];

    // Random index for random message
    const randomIndex = (Math.floor(Math.random() * encouragementArray.length));
    
    // Determining if message should be shown
    if(!(randomChance % 2)){
      const popUpContainer = document.querySelector('.popUpContainer');
      const popUpDiv = document.createElement('div');
      const popUpText = document.createElement('p'); 

      popUpText.innerText = encouragementArray[randomIndex];
      popUpDiv.classList.add('popUpDiv');
      popUpDiv.appendChild(popUpText);
      popUpContainer.appendChild(popUpDiv);
    }
  }
  
  // Resets the trash icon to heart icon for new fact
  useEffect(() => {
    setFavorite(false)
  }, [theFact])

  return (
    <main>
      <div className="factContainer">
        <p className='theFact'>{theFact}</p>
        {/* Swaps between icons and their functionality for current fun fact */}
        {
          favorite ? 
          <FontAwesomeIcon icon={faTrashCan} onClick={() => {
            setFavorite(false);
            //remove from Firebase using key/id
            const database = getDatabase(app);
            const dbRef = ref(database);
            
            onValue(dbRef, (response) => {
              const res = response.val();
              for(let key in res) {
                if(theFact === res[key]) {
                  const currentKey = key;
                  const database = getDatabase(app);
                  const dbRef = ref(database, `/${currentKey}`);
                  remove(dbRef);
                }
              }
            })
          }}/> 
          : 
          <FontAwesomeIcon icon={faHeart} onClick={() => {
            loveIt(theFact);
            showPopUp();
            setFavorite(true);
          }}/> 
        }
      </div>
    </main>
  )
}

export default FunFact;