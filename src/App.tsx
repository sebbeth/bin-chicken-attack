import viteLogo from '/vite.svg'
import './App.css'
import { getDb } from './firebase'
import { ref, set } from 'firebase/database'

function App() {

  function doThing() {
    const database = getDb();
    set(ref(database, 'foo'), {
      bar: 1
    });
  }

  return (
    <>
      <div>
        <p>0000</p>
        <div onClick={() => doThing()}>do Thing</div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
    </>
  )
}

export default App
