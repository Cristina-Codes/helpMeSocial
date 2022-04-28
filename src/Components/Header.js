import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  return (
    <header>
      <div className="titleContainer">
        <h1>FactFinder🔎</h1>
        <div className="iconContainer">
          <FontAwesomeIcon icon={faHeart} />
        </div>
      </div>
    </header>
  )
}

export default Header