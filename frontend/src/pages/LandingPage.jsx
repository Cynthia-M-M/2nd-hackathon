import React from 'react'
import kashelaLogo from '../assets/kashela-logo.png'
import { Link } from 'react-router-dom'
import { 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  CameraIcon,
  MicrophoneIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline'
import ResponsiveImage from '../components/ResponsiveImage'

const features = [
  {
    name: 'Voice Input',
    description: 'Record transactions by speaking naturally',
    icon: MicrophoneIcon,
    gradient: 'from-purple-500 to-indigo-500'
  },
  {
    name: 'Receipt Scanning',
    description: 'Capture receipts with your camera for instant logging',
    icon: CameraIcon,
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    name: 'M-PESA Integration',
    description: 'Seamless mobile money transactions',
    icon: CurrencyDollarIcon,
    gradient: 'from-burgundy-500 to-rose-500'
  },
  {
    name: 'Smart Reports',
    description: 'Detailed financial insights and analytics',
    icon: ChartBarIcon,
    gradient: 'from-amber-500 to-orange-500'
  },
]

export default function LandingPage() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-burgundy-50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[500px] bg-gradient-to-t from-teal-50 to-transparent" />
        <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 blur-3xl opacity-20">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-br from-burgundy-500 to-teal-500" />
        </div>
      </div>

      {/* Hero section */}
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-3xl py-24 sm:py-32 lg:py-40">
          <div className="text-center">
            <div className="relative">
              <div className="w-32 sm:w-40 mx-auto">
                <ResponsiveImage
                  src={kashelaLogo}
                  alt="Kashela logo"
                  className="w-full h-auto transform transition-transform duration-700 hover:scale-110"
                  sizes="(max-width: 640px) 128px, 160px"
                />
              </div>
              <div className="absolute inset-0 -z-10 blur-2xl opacity-20 bg-gradient-to-r from-burgundy-500 to-teal-500 rounded-full" />
            </div>

            <h1 className="text-4xl font-display font-bold tracking-tight bg-gradient-to-r from-burgundy-600 to-teal-600 bg-clip-text text-transparent sm:text-6xl lg:text-7xl">
              Smart Financial Management Made Simple
            </h1>
            <p className="mt-6 text-lg sm:text-xl leading-8 text-gray-600 max-w-2xl mx-auto">
              Track your expenses, manage payments, and gain insights with voice commands and receipt scanning.
              Your personal finance assistant that works as hard as you do.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-burgundy-600 to-teal-600 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-900 hover:text-burgundy-600 transition-colors duration-200 group"
              >
                Log in 
                <ArrowRightIcon className="ml-2 h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pb-24 sm:pb-32">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-burgundy-600">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Smart Features for Smart Finance
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Manage your finances with powerful tools designed to make your life easier.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="relative flex flex-col items-start">
                {/* Gradient background blur */}
                <div className="absolute -inset-x-4 -inset-y-4 z-0 bg-white rounded-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-200" />
                
                {/* Feature content */}
                <div className="relative z-10">
                  <div className={`rounded-xl bg-gradient-to-br ${feature.gradient} p-3 shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <dt className="mt-4 font-semibold text-gray-900">{feature.name}</dt>
                  <dd className="mt-2 leading-7 text-gray-600">{feature.description}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
} 