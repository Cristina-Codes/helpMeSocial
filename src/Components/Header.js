import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const Header = ({ grabTheFaves }) => {
  return (
    <div className="titleContainer">
      <h1>FactFinder🔎</h1>
      <div className="iconContainer">
        <FontAwesomeIcon icon={faHeart} onClick={() => grabTheFaves()}/>
      </div>
    </div>
  )
}

export default Header