import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

const FunFact = ({ theFact, loveIt }) => {
  return (
    <main>
      <div className="factContainer">
        <p className='theFact'>{theFact}</p>
        <FontAwesomeIcon icon={faHeart} onClick={() => loveIt(theFact)}/>
      </div>
    </main>
  )
}

export default FunFact