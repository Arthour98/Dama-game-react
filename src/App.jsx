import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Board from './board/DamaBoard';
import './App.css'

function App() {


  return (
    <>
    <div id="game-window" className="flex justify-center items-center h-[100vh] border border-red-600">
    <Board/>
    </div>
    </>
  )
}

export default App
