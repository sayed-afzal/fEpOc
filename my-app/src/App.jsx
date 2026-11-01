import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'

function AppRoutes() {
  const [theme, setTheme] = useState('light')

  return (
    <div className="app-shell" data-theme={theme}>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={<DashboardPage theme={theme} onThemeChange={setTheme} />}
        />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
