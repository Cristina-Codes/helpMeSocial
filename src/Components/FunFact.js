// Config
import app from "../firebase";
// Modules
import { useState, useEffect } from "react";
import { getDatabase, ref, onValue, remove } from "firebase/database";
// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrashCan } from "@fortawesome/free-regular-svg-icons";

const FunFact = ({ theFact, loveIt }) => {
  // Set state for 'favorite'
  const [favorite, setFavorite] = useState(false);

  // Icon functionalities
  const handleHeartClick = () => {
    loveIt(theFact);
    toShowOrNotToShow();
    setFavorite(true);
  };

  const handleTrashClick = () => {
    setFavorite(false);
    //remove from Firebase using key/id
    const database = getDatabase(app);
    const faveRef = ref(database, "/Favorites");

    onValue(faveRef, (response) => {
      const res = response.val();
      for (let key in res) {
        if (theFact === res[key]) {
          const currentKey = key;
          const database = getDatabase(app);
          const indFaveRef = ref(database, `/Favorites/${currentKey}`);
          remove(indFaveRef);
        }
      }
    });
  };

  // Accessible events
  const handleKeyDownHeart = (e) => {
    if (e.keyCode === 13) {
      handleHeartClick();
    }
  };

  const handleKeyDownTrash = (e) => {
    if (e.keyCode === 13) {
      setFavorite(false);
      handleTrashClick();
    }
  };

  const createPopUp = () => {
    // Messages array
    const encouragementArray = [
      "Not awkward at all!",
      "Totally normal to share that",
      "Why not say it now?",
      "Epic",
      "💛 Everyone will love that 💛",
      "We all clearly need this knowledge",
      "Useless? I think not!",
      "Now the conversation is heating up 🔥",
      "That's 🔥🔥🔥",
      "Erm...maybe that's a bit too odd",
      "On second thought...🫣",
      "Say it...say it now 😈",
      "You'll be using that in every conversation 💬",
      "Practice on the barista? I think so!",
      "You'll get so many dates with that one",
      "The fun begins with that fact!",
    ];

    // Random index for random message
    const randomIndex = Math.floor(Math.random() * encouragementArray.length);

    const popUpContainer = document.querySelector(".popUpContainer");
    const popUpDiv = document.createElement("div");
    const popUpText = document.createElement("p");

    popUpText.innerText = encouragementArray[randomIndex];
    popUpDiv.classList.add("popUpDiv");
    popUpDiv.appendChild(popUpText);
    popUpContainer.appendChild(popUpDiv);
  };

  // Function to show app message randomly
  const toShowOrNotToShow = () => {
    // Random chance to determine if app should show message
    const randomChance = Math.floor(Math.random() * 100);

    // Determining if message should be shown
    if (!(randomChance % 2)) {
      createPopUp();
    }
  };

  // Resets the trash icon to heart icon for new fact
  useEffect(() => {
    setFavorite(false);
  }, [theFact]);

  return (
    <main>
      <div className="factContainer">
        <p>{theFact}</p>
        {/* Swaps between icons and their functionality for current fun fact */}
        {/* Icon swaps, but functionality runs once - revisit this */}
        {favorite ? (
          <FontAwesomeIcon
            icon={faTrashCan}
            onClick={handleTrashClick}
            onKeyDown={handleKeyDownTrash}
            tabIndex="0"
            alt="Icon to remove fact from favorites"
          />
        ) : (
          <FontAwesomeIcon
            icon={faHeart}
            onClick={handleHeartClick}
            onKeyDown={handleKeyDownHeart}
            tabIndex="0"
            alt="Icon to make this a favorite fact"
          />
        )}
      </div>
    </main>
  );
};

export default FunFact;
