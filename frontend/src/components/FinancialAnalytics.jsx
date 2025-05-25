import { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Pie } from 'react-chartjs-2'
import { ArrowDownTrayIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { calculateTotals, groupByCategory, groupByTimePeriod, exportToCSV } from '../utils/analytics'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const CHART_COLORS = {
  primary: '#0d9488',
  secondary: '#ac1d45',
  green: '#059669',
  red: '#dc2626',
  blue: '#2563eb',
  yellow: '#d97706',
  purple: '#7c3aed',
  gray: '#4b5563',
}

export default function FinancialAnalytics({ transactions }) {
  const [timePeriod, setTimePeriod] = useState('monthly')
  const { totalIncome, totalExpenses, netBalance, profitMargin } = calculateTotals(transactions)
  
  // Get expense categories data
  const expensesByCategory = groupByCategory(transactions, 'expense')
  const incomeBySource = groupByCategory(transactions, 'income')
  
  // Get time series data
  const timeSeriesData = groupByTimePeriod(transactions, timePeriod)

  // Prepare data for charts
  const timeSeriesChartData = {
    labels: timeSeriesData.map(d => d.date),
    datasets: [
      {
        label: 'Income',
        data: timeSeriesData.map(d => d.income),
        borderColor: CHART_COLORS.green,
        backgroundColor: CHART_COLORS.green + '20',
        fill: true,
      },
      {
        label: 'Expenses',
        data: timeSeriesData.map(d => d.expenses),
        borderColor: CHART_COLORS.red,
        backgroundColor: CHART_COLORS.red + '20',
        fill: true,
      },
    ],
  }

  const categoryChartData = {
    labels: Object.keys(expensesByCategory),
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: Object.values(CHART_COLORS),
      },
    ],
  }

  const incomeSourceChartData = {
    labels: Object.keys(incomeBySource),
    datasets: [
      {
        data: Object.values(incomeBySource),
        backgroundColor: Object.values(CHART_COLORS),
      },
    ],
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group bg-white rounded-2xl shadow-card p-6 border-l-4 border-teal-500 hover:shadow-lg transition-all duration-300">
          <h3 className="text-sm font-medium text-gray-500">Total Income</h3>
          <p className="mt-2 text-3xl font-display font-semibold text-teal-700 group-hover:scale-105 transition-transform duration-300">
            KES {totalIncome.toLocaleString()}
          </p>
        </div>

        <div className="group bg-white rounded-2xl shadow-card p-6 border-l-4 border-burgundy-500 hover:shadow-lg transition-all duration-300">
          <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
          <p className="mt-2 text-3xl font-display font-semibold text-burgundy-700 group-hover:scale-105 transition-transform duration-300">
            KES {totalExpenses.toLocaleString()}
          </p>
        </div>

        <div className={`group bg-white rounded-2xl shadow-card p-6 border-l-4 ${
          netBalance >= 0 ? 'border-green-500' : 'border-red-500'
        } hover:shadow-lg transition-all duration-300`}>
          <h3 className="text-sm font-medium text-gray-500">Net Balance</h3>
          <p className={`mt-2 text-3xl font-display font-semibold group-hover:scale-105 transition-transform duration-300 ${
            netBalance >= 0 ? 'text-green-700' : 'text-red-700'
          }`}>
            KES {Math.abs(netBalance).toLocaleString()}
          </p>
        </div>

        <div className="group bg-white rounded-2xl shadow-card p-6 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300">
          <h3 className="text-sm font-medium text-gray-500">Profit Margin</h3>
          <p className="mt-2 text-3xl font-display font-semibold text-blue-700 group-hover:scale-105 transition-transform duration-300">
            {profitMargin.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Time Period Selector and Export Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-2xl shadow-card p-4">
        <div className="flex items-center space-x-4">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="rounded-lg border-gray-200 bg-gray-50 py-2 px-3 text-sm focus:border-teal-500 focus:ring-teal-500 transition-colors duration-200"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <button
          onClick={() => exportToCSV(transactions)}
          className="inline-flex items-center px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 focus:ring-2 focus:ring-offset-2 focus:ring-burgundy-500 transition-colors duration-200"
        >
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
          Export to CSV
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Income vs Expenses Over Time */}
        <div className="bg-white rounded-2xl shadow-card p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-display font-medium text-gray-900 mb-4">Income vs Expenses</h3>
          <div className="h-80">
            <Line
              data={timeSeriesChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `KES ${value.toLocaleString()}`,
                    },
                  },
                },
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `KES ${context.raw.toLocaleString()}`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Expense Categories */}
        <div className="bg-white rounded-2xl shadow-card p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-display font-medium text-gray-900 mb-4">Expense Categories</h3>
          <div className="h-80">
            <Pie
              data={categoryChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `KES ${context.raw.toLocaleString()}`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Income Sources */}
        <div className="bg-white rounded-2xl shadow-card p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-display font-medium text-gray-900 mb-4">Income Sources</h3>
          <div className="h-80">
            <Pie
              data={incomeSourceChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `KES ${context.raw.toLocaleString()}`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Monthly Comparison */}
        <div className="bg-white rounded-2xl shadow-card p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-display font-medium text-gray-900 mb-4">Monthly Comparison</h3>
          <div className="h-80">
            <Bar
              data={{
                labels: timeSeriesData.map(d => d.date),
                datasets: [
                  {
                    label: 'Income',
                    data: timeSeriesData.map(d => d.income),
                    backgroundColor: CHART_COLORS.green + '80',
                  },
                  {
                    label: 'Expenses',
                    data: timeSeriesData.map(d => d.expenses),
                    backgroundColor: CHART_COLORS.red + '80',
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `KES ${value.toLocaleString()}`,
                    },
                  },
                },
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `KES ${context.raw.toLocaleString()}`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 