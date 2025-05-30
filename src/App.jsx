import  DamaProvider  from './DamaContext';
import Board from './board/DamaBoard';
import './App.css'

function App() {


  return (
    <>
    <DamaProvider>
    <div id="game-window" className="flex justify-center items-center h-[100vh] border bg-gray-900 z-10">
    <Board/>
    </div>
    </DamaProvider>
    </>
  )
}

export default App
