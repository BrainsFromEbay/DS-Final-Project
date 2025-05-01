//import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login  from '../components/login'
import Signup from "../components/singup"
import Home from "../components/Home"
import Header from "../components/Header"

function App() {

  return (
    <>
    {/* BrowserRouter and Routes for routing */}
      <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path="/" element={
          <Home />
        } />
        <Route path="/login" element={
          <Login />
        }/>
        <Route path="/signup" element={
          <Signup />
        }/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App