// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faTrashCan } from '@fortawesome/free-solid-svg-icons';
// Modules
import { Routes, Route, Link } from 'react-router-dom';
import { getDatabase, ref, remove } from 'firebase/database';
// Config
import app from '../firebase';

const AllFavesList = ({everyFavorite}) => {

  const handleTrashClick = (e) => {
    const tagName = e.target.tagName;
    if(tagName === "path"){
      const objKey = e.target.parentElement.parentElement.id;
      const database = getDatabase(app);
      const indFaveRef = ref(database, `/Favorites/${objKey}`);
      remove(indFaveRef);
    }else if(tagName === "svg"){
      const objKey = e.target.parentElement.id;
      const database = getDatabase(app);
      const indFaveRef = ref(database, `/Favorites/${objKey}`);
      remove(indFaveRef);
    }
  }

  const handleKeyDownTrash = (e) => {
    if(e.keyCode === 13){
      handleTrashClick(e);
    }
  }

  return (
    <div className="faveDisplay">
      <header className="faveHeader">
        <h3>Favorite Facts</h3>
        <Link to="/">
          <FontAwesomeIcon 
            icon={faX} 
          />
        </Link>
      </header>
      {
        everyFavorite.map((favorite) => {
          return(
            <div className='faveDiv' id={favorite.key} key={favorite.key}>
              <p>{favorite.string}</p>
              <FontAwesomeIcon 
                icon={faTrashCan}
                onClick={handleTrashClick}
                onKeyDown={handleKeyDownTrash}
                className="trashIcon"
              />
            </div>
          )
        })
      }
      <div className="deleteAll">
        <p>Want to start fresh? Delete all saved facts below.</p>
        <button>
          Delete them all!
        </button>
      </div>

      <Routes>
        <Route path="/" />
      </Routes>
    </div>
  )
}

export default AllFavesList;