import app from '../firebase';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrashCan } from '@fortawesome/free-regular-svg-icons';

const FunFact = ({ theFact, loveIt }) => {
  const [ favorite, setFavorite ] = useState(false);

  return (
    <main>
      <div className="factContainer">
        <p className='theFact'>{theFact}</p>
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
            setFavorite(true);
          }}/> 
        }
      </div>
    </main>
  )
}

export default FunFact