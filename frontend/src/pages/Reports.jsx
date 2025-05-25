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
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-semibold text-gray-900">Financial Reports</h2>
          <p className="mt-2 text-gray-600">View and analyze your financial data</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="input-field"
          />
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="btn-secondary flex items-center"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="card bg-green-50">
          <h3 className="text-lg font-medium text-green-900">Total Income</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">KES 150,000</p>
          <p className="mt-1 text-sm text-green-500">+12% from last month</p>
        </div>

        <div className="card bg-red-50">
          <h3 className="text-lg font-medium text-red-900">Total Expenses</h3>
          <p className="mt-2 text-3xl font-semibold text-red-600">KES 47,000</p>
          <p className="mt-1 text-sm text-red-500">-5% from last month</p>
        </div>

        <div className="card bg-blue-50">
          <h3 className="text-lg font-medium text-blue-900">Savings</h3>
          <p className="mt-2 text-3xl font-semibold text-blue-600">KES 103,000</p>
          <p className="mt-1 text-sm text-blue-500">68.7% of income</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Bar Chart */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Categories</h3>
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#0d9488" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Distribution</h3>
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
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
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
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    2024-01-{15 - index}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Sample Transaction {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {monthlyData[index % monthlyData.length].category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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