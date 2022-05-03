import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const Header = ({ grabTheFaves, showNumOfFave }) => {
  // Make icon functional with enter key
  const handleKeyDown = (e) => {
    if(e.keyCode === 13){
      grabTheFaves();
    }
  }

  return (
    <div className="titleContainer">
      <h1>HelpMeSocial💬</h1>
      <div className="iconContainer">
        <FontAwesomeIcon icon={faHeart} onClick={grabTheFaves} onKeyDown={handleKeyDown} tabIndex='0' alt='Icon to open list of all favorite facts'/>
        <p className='numOfFaves'>{showNumOfFave}</p>
      </div>
    </div>
  )
}

export default Header;