import { format, parse, isToday, isYesterday, isThisWeek, isThisMonth, isThisYear } from 'date-fns';
import { ja } from 'date-fns/locale';

// Format date to display
export const formatDate = (date, formatStr = 'yyyy/MM/dd') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: ja });
};

// Format currency
export const formatCurrency = (amount, currency = 'JPY') => {
  if (amount === undefined || amount === null) return '';
  
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Get relative date string
export const getRelativeDateString = (dateString) => {
  const date = new Date(dateString);
  
  if (isToday(date)) return '今日';
  if (isYesterday(date)) return '昨日';
  if (isThisWeek(date)) return format(date, 'EEEE', { locale: ja });
  if (isThisMonth(date)) return format(date, 'M月d日', { locale: ja });
  if (isThisYear(date)) return format(date, 'M月d日', { locale: ja });
  
  return format(date, 'yyyy/MM/dd', { locale: ja });
};

// Group transactions by date
export const groupTransactionsByDate = (transactions) => {
  if (!transactions || transactions.length === 0) return [];
  
  const groups = {};
  
  transactions.forEach(transaction => {
    const date = transaction.date.split('T')[0]; // Get YYYY-MM-DD part
    
    if (!groups[date]) {
      groups[date] = [];
    }
    
    groups[date].push(transaction);
  });
  
  // Convert to array and sort by date (newest first)
  return Object.keys(groups)
    .sort((a, b) => new Date(b) - new Date(a))
    .map(date => ({
      date,
      transactions: groups[date],
    }));
};

// Calculate total income, expenses and balance
export const calculateFinancialSummary = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return { income: 0, expenses: 0, balance: 0 };
  }
  
  return transactions.reduce(
    (summary, transaction) => {
      const amount = Number(transaction.amount);
      
      if (transaction.type === 'income') {
        summary.income += amount;
      } else {
        summary.expenses += amount;
      }
      
      summary.balance = summary.income - summary.expenses;
      
      return summary;
    },
    { income: 0, expenses: 0, balance: 0 }
  );
};

// Calculate category totals
export const calculateCategoryTotals = (transactions) => {
  if (!transactions || transactions.length === 0) return [];
  
  const categoryTotals = {};
  
  transactions.forEach(transaction => {
    if (transaction.type !== 'expense') return;
    
    const { categoryId, amount, category } = transaction;
    const categoryName = category?.name || 'その他';
    const categoryColor = category?.color || '#CCCCCC';
    
    if (!categoryTotals[categoryId]) {
      categoryTotals[categoryId] = {
        id: categoryId,
        name: categoryName,
        color: categoryColor,
        total: 0,
      };
    }
    
    categoryTotals[categoryId].total += Number(amount);
  });
  
  // Convert to array and sort by total (highest first)
  return Object.values(categoryTotals).sort((a, b) => b.total - a.total);
};

// Filter transactions by date range
export const filterTransactionsByDateRange = (transactions, startDate, endDate) => {
  if (!transactions || transactions.length === 0) return [];
  if (!startDate && !endDate) return transactions;
  
  const start = startDate ? new Date(startDate) : new Date(0);
  const end = endDate ? new Date(endDate) : new Date();
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= start && transactionDate <= end;
  });
};

// Filter transactions by category
export const filterTransactionsByCategory = (transactions, categoryId) => {
  if (!transactions || transactions.length === 0) return [];
  if (!categoryId) return transactions;
  
  return transactions.filter(transaction => transaction.categoryId === categoryId);
};

// Filter transactions by type (income/expense)
export const filterTransactionsByType = (transactions, type) => {
  if (!transactions || transactions.length === 0) return [];
  if (!type) return transactions;
  
  return transactions.filter(transaction => transaction.type === type);
};

// Generate monthly report data
export const generateMonthlyReportData = (transactions, month, year) => {
  const date = new Date(year, month);
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  const filteredTransactions = filterTransactionsByDateRange(
    transactions,
    startOfMonth,
    endOfMonth
  );
  
  const summary = calculateFinancialSummary(filteredTransactions);
  const categoryTotals = calculateCategoryTotals(filteredTransactions);
  
  // Generate daily data for line chart
  const dailyData = [];
  let currentDate = new Date(startOfMonth);
  
  while (currentDate <= endOfMonth) {
    const day = format(currentDate, 'yyyy-MM-dd');
    const dayTransactions = filteredTransactions.filter(
      t => t.date.startsWith(day)
    );
    
    const { income, expenses } = calculateFinancialSummary(dayTransactions);
    
    dailyData.push({
      date: day,
      income,
      expenses,
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return {
    summary,
    categoryTotals,
    dailyData,
  };
};

// Generate yearly report data
export const generateYearlyReportData = (transactions, year) => {
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);
  
  const filteredTransactions = filterTransactionsByDateRange(
    transactions,
    startOfYear,
    endOfYear
  );
  
  const summary = calculateFinancialSummary(filteredTransactions);
  const categoryTotals = calculateCategoryTotals(filteredTransactions);
  
  // Generate monthly data for line chart
  const monthlyData = [];
  
  for (let month = 0; month < 12; month++) {
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);
    
    const monthTransactions = filterTransactionsByDateRange(
      filteredTransactions,
      startOfMonth,
      endOfMonth
    );
    
    const { income, expenses } = calculateFinancialSummary(monthTransactions);
    
    monthlyData.push({
      month: format(startOfMonth, 'MMM', { locale: ja }),
      income,
      expenses,
    });
  }
  
  return {
    summary,
    categoryTotals,
    monthlyData,
  };
};

// Check if budget is exceeded
export const checkBudgetExceeded = (budget, transactions) => {
  if (!budget || !transactions || transactions.length === 0) return false;
  
  const { amount, categoryId, period } = budget;
  
  let startDate;
  const now = new Date();
  
  switch (period) {
    case 'daily':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'weekly':
      const day = now.getDay();
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
      break;
    case 'monthly':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'yearly':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Default to monthly
  }
  
  let filteredTransactions = filterTransactionsByDateRange(transactions, startDate, now);
  
  if (categoryId) {
    filteredTransactions = filterTransactionsByCategory(filteredTransactions, categoryId);
  } else {
    filteredTransactions = filterTransactionsByType(filteredTransactions, 'expense');
  }
  
  const { expenses } = calculateFinancialSummary(filteredTransactions);
  
  return expenses > amount;
};

// Convert object to CSV string
export const objectToCSV = (data) => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Add header row
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      
      // Escape commas and quotes
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};
