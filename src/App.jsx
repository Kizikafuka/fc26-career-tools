import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/layout/Navbar'
import SquadPage from './pages/squad/SquadPage'

export default function App() {
  const [theme, setTheme] = useState('career-dark')

  const toggleTheme = () => {
    setTheme(prev => prev === 'career-dark' ? 'career-light' : 'career-dark')
  }

  return (
    <div data-theme={theme} className="min-h-screen bg-base-100 text-base-content">
      <BrowserRouter>
        <Navbar theme={theme} onToggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Navigate to="/squad" replace />} />
          <Route path="/squad" element={<SquadPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}