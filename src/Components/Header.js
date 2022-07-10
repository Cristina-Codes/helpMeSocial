// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
// Modules
import { Link } from "react-router-dom";

const Header = ({ numOfFave }) => {
  return (
    <div className="titleContainer">
      <h1>HelpMeSocial💬</h1>
      <Link to="/favorites">
        <FontAwesomeIcon
          icon={faHeart}
          alt="Icon to open list of all favorite facts"
        />
        <p className="numOfFaves">{numOfFave}</p>
      </Link>
    </div>
  );
};

export default Header;
