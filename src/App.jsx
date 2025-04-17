import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PieChart from './components/Piechart'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar></Navbar>
      <PieChart></PieChart>
      <Footer></Footer>
    </>
  )
}

export default App
