// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faTrashCan } from "@fortawesome/free-solid-svg-icons";
// Modules
import { Routes, Route, Link } from "react-router-dom";
import { getDatabase, ref, remove } from "firebase/database";
// Config
import app from "../firebase";

const AllFavesList = ({ everyFavorite }) => {
  const handleTrashClick = (e) => {
    const objKey = e.target.parentElement.id;
    const database = getDatabase(app);
    const indFaveRef = ref(database, `/Favorites/${objKey}`);
    remove(indFaveRef);
  };

  const handleKeyDownTrash = (e) => {
    if (e.keyCode === 13) {
      handleTrashClick(e);
    }
  };

  const deleteAllFaves = () => {
    const database = getDatabase(app);
    const allFaveRef = ref(database, `/Favorites`);
    remove(allFaveRef);
  };

  return (
    <>
      {everyFavorite !== undefined ? (
        <div className="faveDisplay">
          <header className="faveHeader">
            <h3>Favorite Facts</h3>
            <Link to="/">
              <FontAwesomeIcon icon={faX} />
            </Link>
          </header>
          {everyFavorite.map((favorite) => {
            return (
              <div className="faveDiv" id={favorite.key} key={favorite.key}>
                <p>{favorite.string}</p>
                <FontAwesomeIcon
                  icon={faTrashCan}
                  tabIndex="0"
                  onClick={handleTrashClick}
                  onKeyDown={handleKeyDownTrash}
                  className="trashIcon"
                />
              </div>
            );
          })}
          <div className="deleteAll">
            <p>Want to start fresh? Delete all saved facts below.</p>
            <button onClick={deleteAllFaves}>Delete them all!</button>
          </div>

          <Routes>
            <Route path="/" />
          </Routes>
        </div>
      ) : (
        <p className="loading">Loading...</p>
      )}
    </>
  );
};

export default AllFavesList;
