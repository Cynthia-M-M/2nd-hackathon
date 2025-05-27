import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  EnvelopeIcon, 
  LockClosedIcon,
  ArrowPathIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Implement Supabase authentication
      toast.success('Successfully logged in!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message || 'Failed to log in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl sm:text-4xl font-display font-bold bg-gradient-to-r from-burgundy-600 to-teal-600 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="mt-3 text-base text-gray-600">
          Sign in to your account to continue
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="font-medium text-burgundy-600 hover:text-burgundy-500 inline-flex items-center group"
          >
            Create one now
            <ArrowRightIcon className="ml-1 h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-shadow duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-shadow duration-200"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-200 text-burgundy-600 focus:ring-burgundy-500 transition-colors duration-200"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a 
                  href="#" 
                  className="font-medium text-burgundy-600 hover:text-burgundy-500 transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-burgundy-600 to-teal-600 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 