import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'

// Lazy load route components
const LandingPage = lazy(() => import('./pages/LandingPage'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Payments = lazy(() => import('./pages/Payments'))
const Reports = lazy(() => import('./pages/Reports'))

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="spinner h-12 w-12 border-4 border-teal-500 rounded-full"></div>
  </div>
)

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
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
