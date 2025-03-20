import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Platform
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { format, subMonths, addMonths } from 'date-fns';
import { ja } from 'date-fns/locale';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

// Import components
import PieChart from '../components/PieChart';
import LineChart from '../components/LineChart';
import FinancialSummary from '../components/FinancialSummary';
import Button from '../components/Button';

// Import actions
import { fetchTransactions } from '../store/slices/transactionsSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';

// Import utils
import { 
  calculateFinancialSummary, 
  calculateCategoryTotals,
  generateMonthlyReportData,
  generateYearlyReportData,
  filterTransactionsByDateRange,
  filterTransactionsByCategory,
  filterTransactionsByType
} from '../utils/dataUtils';

const ReportsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { transactions } = useSelector(state => state.transactions);
  const { categories } = useSelector(state => state.categories);
  const { darkMode } = useSelector(state => state.theme);
  
  // State for report filters
  const [reportType, setReportType] = useState('monthly'); // 'monthly' or 'yearly'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [transactionType, setTransactionType] = useState('all'); // 'all', 'income', or 'expense'
  
  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
  }, [dispatch]);
  
  // Format date for display
  const formatDateForDisplay = () => {
    if (reportType === 'monthly') {
      return format(currentDate, 'yyyy年M月', { locale: ja });
    } else {
      return format(currentDate, 'yyyy年', { locale: ja });
    }
  };
  
  // Navigate to previous period
  const goToPreviousPeriod = () => {
    if (reportType === 'monthly') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear() - 1, 0, 1));
    }
  };
  
  // Navigate to next period
  const goToNextPeriod = () => {
    if (reportType === 'monthly') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear() + 1, 0, 1));
    }
  };
  
  // Filter transactions based on current filters
  const getFilteredTransactions = () => {
    let filtered = [...transactions];
    
    // Filter by date range
    if (reportType === 'monthly') {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      filtered = filterTransactionsByDateRange(filtered, startOfMonth, endOfMonth);
    } else {
      const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
      const endOfYear = new Date(currentDate.getFullYear(), 11, 31);
      filtered = filterTransactionsByDateRange(filtered, startOfYear, endOfYear);
    }
    
    // Filter by category
    if (selectedCategory) {
      filtered = filterTransactionsByCategory(filtered, selectedCategory);
    }
    
    // Filter by transaction type
    if (transactionType !== 'all') {
      filtered = filterTransactionsByType(filtered, transactionType);
    }
    
    return filtered;
  };
  
  // Get report data
  const getReportData = () => {
    const filteredTransactions = getFilteredTransactions();
    
    if (reportType === 'monthly') {
      return generateMonthlyReportData(
        filteredTransactions, 
        currentDate.getMonth(), 
        currentDate.getFullYear()
      );
    } else {
      return generateYearlyReportData(
        filteredTransactions, 
        currentDate.getFullYear()
      );
    }
  };
  
  // Get category options
  const getCategoryOptions = () => {
    return [
      { id: null, name: 'すべてのカテゴリ' },
      ...categories.filter(c => 
        transactionType === 'all' || c.type === transactionType
      )
    ];
  };
  
  // Handle export to CSV
  const handleExportCSV = () => {
    // This would be implemented in a real app to export data
    alert('CSVエクスポート機能は実際のアプリで実装されます');
  };
  
  const reportData = getReportData();
  const categoryOptions = getCategoryOptions();
  
  return (
    <SafeAreaView style={[
      styles.container, 
      { backgroundColor: darkMode ? COLORS.backgroundDark : COLORS.background }
    ]}>
      <View style={styles.header}>
        <Text style={[
          styles.headerTitle,
          { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
        ]}>
          レポート
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Report Type Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[
              styles.toggleButton,
              reportType === 'monthly' && { backgroundColor: COLORS.primary },
            ]}
            onPress={() => setReportType('monthly')}
          >
            <Text style={[
              styles.toggleButtonText,
              reportType === 'monthly' && { color: COLORS.surface },
            ]}>
              月次
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.toggleButton,
              reportType === 'yearly' && { backgroundColor: COLORS.primary },
            ]}
            onPress={() => setReportType('yearly')}
          >
            <Text style={[
              styles.toggleButtonText,
              reportType === 'yearly' && { color: COLORS.surface },
            ]}>
              年次
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Date Navigation */}
        <View style={styles.dateNavigation}>
          <TouchableOpacity onPress={goToPreviousPeriod}>
            <MaterialIcons 
              name="chevron-left" 
              size={24} 
              color={darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary} 
            />
          </TouchableOpacity>
          <Text style={[
            styles.dateText,
            { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
          ]}>
            {formatDateForDisplay()}
          </Text>
          <TouchableOpacity onPress={goToNextPeriod}>
            <MaterialIcons 
              name="chevron-right" 
              size={24} 
              color={darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary} 
            />
          </TouchableOpacity>
        </View>
        
        {/* Filters */}
        <View style={styles.filtersContainer}>
          <Text style={[
            styles.filterLabel,
            { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
          ]}>
            フィルター:
          </Text>
          
          <View style={styles.filterButtons}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
            >
              <TouchableOpacity 
                style={[
                  styles.filterButton,
                  transactionType === 'all' && { backgroundColor: COLORS.primary },
                ]}
                onPress={() => setTransactionType('all')}
              >
                <Text style={[
                  styles.filterButtonText,
                  transactionType === 'all' && { color: COLORS.surface },
                ]}>
                  すべて
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.filterButton,
                  transactionType === 'income' && { backgroundColor: COLORS.income },
                ]}
                onPress={() => setTransactionType('income')}
              >
                <Text style={[
                  styles.filterButtonText,
                  transactionType === 'income' && { color: COLORS.surface },
                ]}>
                  収入
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.filterButton,
                  transactionType === 'expense' && { backgroundColor: COLORS.expense },
                ]}
                onPress={() => setTransactionType('expense')}
              >
                <Text style={[
                  styles.filterButtonText,
                  transactionType === 'expense' && { color: COLORS.surface },
                ]}>
                  支出
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          
          <View style={styles.categoryFilter}>
            <Text style={[
              styles.filterLabel,
              { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
            ]}>
              カテゴリ:
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoryButtons}
            >
              {categoryOptions.map((category) => (
                <TouchableOpacity 
                  key={category.id || 'all'}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && { 
                      backgroundColor: category.color || COLORS.primary 
                    },
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === category.id && { color: COLORS.surface },
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
        
        {/* Financial Summary */}
        <FinancialSummary 
          income={reportData.summary.income}
          expenses={reportData.summary.expenses}
          balance={reportData.summary.balance}
          period={formatDateForDisplay()}
        />
        
        {/* Expense Breakdown */}
        {reportData.categoryTotals.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={[
              styles.chartTitle,
              { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
            ]}>
              支出内訳
            </Text>
            <PieChart 
              data={reportData.categoryTotals}
              totalAmount={reportData.summary.expenses}
            />
          </View>
        )}
        
        {/* Income/Expense Trend */}
        <View style={styles.chartContainer}>
          <Text style={[
            styles.chartTitle,
            { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
          ]}>
            収支推移
          </Text>
          <LineChart 
            data={reportType === 'monthly' ? reportData.dailyData : reportData.monthlyData}
            title={`${formatDateForDisplay()}の収支推移`}
            xAxisLabel={reportType === 'monthly' ? '日付' : '月'}
            yAxisLabel="金額 (円)"
          />
        </View>
        
        {/* Export Button */}
        <Button 
          title="CSVでエクスポート"
          icon="file-download"
          type="outline"
          onPress={handleExportCSV}
          fullWidth
          style={styles.exportButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  headerTitle: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  dateNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontSize: SIZES.large,
    fontWeight: '600',
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: SIZES.medium,
    fontWeight: '500',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  categoryFilter: {
    marginBottom: 8,
  },
  categoryButtons: {
    flexDirection: 'row',
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    marginRight: 8,
  },
  categoryButtonText: {
    fontSize: SIZES.small,
    fontWeight: '500',
  },
  chartContainer: {
    marginVertical: 16,
  },
  chartTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    marginBottom: 12,
  },
  exportButton: {
    marginVertical: 20,
  },
});

export default ReportsScreen;
