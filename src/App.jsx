import  DamaProvider  from './DamaContext';
import Board from './board/DamaBoard';
import './App.css'

function App() {


  return (
    <>
    <DamaProvider>
    <div id="game-window" className="flex justify-center items-center h-[100vh] border border-red-600">
    <Board/>
    </div>
    </DamaProvider>
    </>
  )
}

export default App
