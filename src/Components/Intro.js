const Intro = ({nowClicked}) => {
  return (
    <div className="intro">
      <p>Forgotten how to <span>social?</span> Make it awkward by dropping random facts into the convo!</p>
      <button onClick={(e) => nowClicked(e)}>Bring on the Facts!</button>
    </div>
  )
}

export default Intro;