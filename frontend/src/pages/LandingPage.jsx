import { Link } from 'react-router-dom'
import { 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  CameraIcon,
  MicrophoneIcon 
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Voice Input',
    description: 'Record transactions by speaking naturally',
    icon: MicrophoneIcon,
  },
  {
    name: 'Receipt Scanning',
    description: 'Capture receipts with your camera for instant logging',
    icon: CameraIcon,
  },
  {
    name: 'M-PESA Integration',
    description: 'Seamless mobile money transactions',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Smart Reports',
    description: 'Detailed financial insights and analytics',
    icon: ChartBarIcon,
  },
]

export default function LandingPage() {
  return (
    <div className="relative isolate">
      {/* Background gradient */}
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-200 to-secondary-200 opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
        />
      </div>

      {/* Hero section */}
      <div className="px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold tracking-tight text-gray-900 sm:text-6xl">
              Smart Financial Management Made Simple
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Track your expenses, manage payments, and gain insights with voice commands and receipt scanning.
              Your personal finance assistant that works as hard as you do.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/register"
                className="btn-primary text-base"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="text-base font-semibold leading-6 text-gray-900 hover:text-primary-600 transition-colors duration-200"
              >
                Log in <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Smart Features for Smart Finance
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Manage your finances with powerful tools designed to make your life easier.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col items-start">
                <div className="rounded-lg bg-primary-100 p-2 ring-1 ring-primary-900/10">
                  <feature.icon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                </div>
                <dt className="mt-4 font-semibold text-gray-900">{feature.name}</dt>
                <dd className="mt-2 leading-7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
} 