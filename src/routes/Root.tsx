import viteLogo from '/vite.svg'
import '../styles.css'
import { Outlet, useNavigate } from 'react-router-dom';
import { createNewGame } from '../game.data';

function Root() {
  const navigate = useNavigate();

  function onStartNewGame() {
    const gameId = createNewGame();
    navigate("/game/" + gameId);
  }

  return (
    <>
      <div>
        <p>0000</p>
        <button onClick={onStartNewGame}>Start New Game</button>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <Outlet/>
      </div>
    </>
  )
}

export default Root
