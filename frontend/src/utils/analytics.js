// Helper function to group transactions by category
export const groupByCategory = (transactions, type = 'expense') => {
  return transactions
    .filter(t => t.type === type)
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount
      return acc
    }, {})
}

// Calculate totals
export const calculateTotals = (transactions) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    profitMargin: totalIncome ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
  }
}

// Group transactions by time period
export const groupByTimePeriod = (transactions, period = 'daily') => {
  const grouped = transactions.reduce((acc, curr) => {
    let key
    const date = new Date(curr.date)
    let day, diff
    
    switch (period) {
      case 'daily':
        key = date.toISOString().split('T')[0]
        break
      case 'weekly':
        // Get Monday of the week
        day = date.getDay()
        diff = date.getDate() - day + (day === 0 ? -6 : 1)
        key = new Date(date.setDate(diff)).toISOString().split('T')[0]
        break
      case 'monthly':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        break
      default:
        key = date.toISOString().split('T')[0]
    }

    if (!acc[key]) {
      acc[key] = { income: 0, expenses: 0 }
    }
    
    if (curr.type === 'income') {
      acc[key].income += curr.amount
    } else {
      acc[key].expenses += curr.amount
    }

    return acc
  }, {})

  // Convert to array and sort by date
  return Object.entries(grouped)
    .map(([date, values]) => ({
      date,
      ...values
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}

// Export transactions to CSV
export const exportToCSV = (transactions) => {
  const headers = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Reference']
  const rows = transactions.map(t => [
    t.date,
    t.type,
    t.category,
    t.description || '',
    t.amount,
    t.reference || ''
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `financial-report-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.display = 'none'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
} 