import { Link } from 'react-router-dom'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Payments', href: '/payments' },
  { name: 'Reports', href: '/reports' },
]

export default function Navbar() {
  return (
    <Disclosure as="nav" className="bg-white shadow-lg backdrop-blur-sm bg-white/90 sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              <div className="flex items-center">
                <Link to="/" className="flex flex-shrink-0 items-center group">
                  <span className="text-2xl font-display font-bold bg-gradient-to-r from-burgundy-600 to-teal-600 bg-clip-text text-transparent transition-all duration-300 ease-in-out transform group-hover:scale-105">
                    Kashela
                  </span>
                </Link>
                <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="relative inline-flex items-center px-2 pt-1 text-sm font-medium text-gray-900 hover:text-burgundy-600 transition-colors duration-200 group"
                    >
                      {item.name}
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-burgundy-600 to-teal-600 transform scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                <Link
                  to="/login"
                  className="text-gray-900 hover:text-burgundy-600 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:bg-burgundy-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-burgundy-600 to-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  Register
                </Link>
              </div>
              
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-burgundy-50 hover:text-burgundy-600 transition-colors duration-200">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2 bg-white/95 backdrop-blur-sm">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className="block py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:bg-gradient-to-r hover:from-burgundy-50 hover:to-teal-50 hover:text-burgundy-600 transition-all duration-200"
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-100 pb-3 pt-4 bg-white/95 backdrop-blur-sm">
              <div className="space-y-1 px-4">
                <Disclosure.Button
                  as={Link}
                  to="/login"
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-600 hover:bg-gradient-to-r hover:from-burgundy-50 hover:to-teal-50 hover:text-burgundy-600 rounded-lg transition-all duration-200"
                >
                  Login
                </Disclosure.Button>
                <Disclosure.Button
                  as={Link}
                  to="/register"
                  className="block w-full text-left px-4 py-2 text-base font-medium bg-gradient-to-r from-burgundy-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  Register
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
} 