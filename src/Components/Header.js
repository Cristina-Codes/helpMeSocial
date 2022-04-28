import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const Header = ({ showTheFaves }) => {
  return (
    <header>
      <div className="titleContainer">
        <h1>FactFinder🔎</h1>
        <div className="iconContainer">
          <FontAwesomeIcon icon={faHeart} onClick={() => showTheFaves()}/>
        </div>
      </div>
    </header>
  )
}

export default Header