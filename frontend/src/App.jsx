import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Payments from './pages/Payments'
import Reports from './pages/Reports'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-burgundy-50 via-white to-teal-50">
        <Toaster 
          position="top-right" 
          toastOptions={{
            className: 'bg-white shadow-lg rounded-lg p-4 text-sm font-medium',
            duration: 4000,
          }}
        />
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
