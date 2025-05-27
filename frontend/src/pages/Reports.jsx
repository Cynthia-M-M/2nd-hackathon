import { useState } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  ArrowDownTrayIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

// Dummy data for demonstration
const monthlyData = [
  { category: 'Food', amount: 15000 },
  { category: 'Transport', amount: 8000 },
  { category: 'Entertainment', amount: 5000 },
  { category: 'Shopping', amount: 12000 },
  { category: 'Utilities', amount: 7000 },
]

const COLORS = ['#0d9488', '#be185d', '#0891b2', '#4f46e5', '#d97706']

export default function Reports() {
  const [selectedMonth, setSelectedMonth] = useState('2024-01')
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      // TODO: Implement CSV export
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Simulate file download
      const element = document.createElement('a')
      element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent('Category,Amount\n' + monthlyData.map(item => `${item.category},${item.amount}`).join('\n')))
      element.setAttribute('download', `financial-report-${selectedMonth}.csv`)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-burgundy-600 to-teal-600 bg-clip-text text-transparent">
            Financial Reports
          </h2>
          <p className="mt-2 text-gray-600 text-sm sm:text-base">
            View and analyze your financial data
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-shadow duration-200"
            />
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-burgundy-600 to-teal-600 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative group bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600">Total Income</p>
              <p className="mt-2 text-3xl font-display font-bold text-emerald-700">KES 150,000</p>
            </div>
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md group-hover:shadow-lg transition-shadow duration-200">
              <ArrowTrendingUpIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-emerald-600">
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
            +12% from last month
          </div>
        </div>

        <div className="relative group bg-gradient-to-br from-rose-50 to-burgundy-50 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-rose-600">Total Expenses</p>
              <p className="mt-2 text-3xl font-display font-bold text-rose-700">KES 47,000</p>
            </div>
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-rose-500 to-burgundy-500 text-white shadow-md group-hover:shadow-lg transition-shadow duration-200">
              <ArrowTrendingDownIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-rose-600">
            <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
            -5% from last month
          </div>
        </div>

        <div className="relative group bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-200 sm:col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-teal-600">Savings</p>
              <p className="mt-2 text-3xl font-display font-bold text-teal-700">KES 103,000</p>
            </div>
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-md group-hover:shadow-lg transition-shadow duration-200">
              <BanknotesIcon className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-teal-600">
            68.7% of income
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-6">Expense Categories</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#be185d" />
                    <stop offset="100%" stopColor="#0d9488" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-6">Expense Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={monthlyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {monthlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-display font-semibold text-gray-900">Transaction History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2024-01-{15 - index}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Sample Transaction {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-burgundy-50 to-teal-50 text-gray-800">
                      {monthlyData[index % monthlyData.length].category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    KES {(Math.random() * 10000).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 