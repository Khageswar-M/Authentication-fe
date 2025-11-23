import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import LoggedUsers from './components/LoggedUsers'
import Dashboard from './components/Dashboard'

function App() {

  return (
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/logged-users' element={<LoggedUsers />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </Router>
  )
}

export default App
