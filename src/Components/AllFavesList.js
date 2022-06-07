// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faTrashCan } from '@fortawesome/free-solid-svg-icons';
// Modules
import { Routes, Route, Link } from 'react-router-dom';


const AllFavesList = ({everyFavorite}) => {

  return (
    <div className="faveDisplay">
      <header>
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
            <div className='faveDiv' key={favorite.key}>
              <p>{favorite.string}</p>
              <FontAwesomeIcon 
                icon={faTrashCan}
              />
            </div>
          )
        })
      }
      <Routes>
        <Route path="/" />
      </Routes>
    </div>
  )
}

export default AllFavesList;