import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

// Import components
import FinancialSummary from '../components/FinancialSummary';
import TransactionItem from '../components/TransactionItem';
import PieChart from '../components/PieChart';
import Button from '../components/Button';

// Import actions
import { fetchTransactions } from '../store/slices/transactionsSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';

// Import utils
import { 
  calculateFinancialSummary, 
  calculateCategoryTotals,
  groupTransactionsByDate
} from '../utils/dataUtils';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { transactions, status: transactionsStatus } = useSelector(state => state.transactions);
  const { categories } = useSelector(state => state.categories);
  const { darkMode } = useSelector(state => state.theme);
  
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [financialSummary, setFinancialSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0
  });
  
  // Fetch data on component mount
  useEffect(() => {
    if (user) {
      dispatch(fetchTransactions());
      dispatch(fetchCategories());
    }
  }, [dispatch, user]);
  
  // Process transactions data
  useEffect(() => {
    if (transactions.length > 0) {
      // Get recent transactions (last 5)
      const sorted = [...transactions].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      setRecentTransactions(sorted.slice(0, 5));
      
      // Calculate financial summary
      const summary = calculateFinancialSummary(transactions);
      setFinancialSummary(summary);
      
      // Calculate category totals for expenses
      const expenseTransactions = transactions.filter(t => t.type === 'expense');
      const categoryTotals = calculateCategoryTotals(expenseTransactions);
      setCategoryData(categoryTotals);
    }
  }, [transactions, categories]);
  
  // Handle add transaction button press
  const handleAddTransaction = () => {
    navigation.navigate('TransactionForm');
  };
  
  // Handle transaction item press
  const handleTransactionPress = (transaction) => {
    navigation.navigate('TransactionForm', { transaction });
  };
  
  // Handle view all transactions press
  const handleViewAllTransactions = () => {
    navigation.navigate('Reports');
  };
  
  return (
    <SafeAreaView style={[
      styles.container, 
      { backgroundColor: darkMode ? COLORS.backgroundDark : COLORS.background }
    ]}>
      <StatusBar 
        barStyle={darkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={darkMode ? COLORS.backgroundDark : COLORS.background}
      />
      
      <View style={styles.header}>
        <Text style={[
          styles.headerTitle,
          { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
        ]}>
          My Money Manager
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Financial Summary */}
        <FinancialSummary 
          income={financialSummary.income}
          expenses={financialSummary.expenses}
          balance={financialSummary.balance}
          onPress={handleViewAllTransactions}
        />
        
        {/* Quick Add Button */}
        <Button 
          title="取引を追加"
          icon="add"
          onPress={handleAddTransaction}
          fullWidth
          style={styles.addButton}
        />
        
        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[
              styles.sectionTitle,
              { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
            ]}>
              最近の取引
            </Text>
            <TouchableOpacity onPress={handleViewAllTransactions}>
              <Text style={styles.viewAllText}>すべて表示</Text>
            </TouchableOpacity>
          </View>
          
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <TransactionItem 
                key={transaction.id}
                transaction={transaction}
                onPress={handleTransactionPress}
              />
            ))
          ) : (
            <Text style={[
              styles.emptyText,
              { color: darkMode ? COLORS.textSecondaryDark : COLORS.textSecondary }
            ]}>
              取引がありません
            </Text>
          )}
        </View>
        
        {/* Expense Breakdown */}
        {categoryData.length > 0 && (
          <View style={styles.section}>
            <Text style={[
              styles.sectionTitle,
              { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
            ]}>
              支出内訳
            </Text>
            
            <PieChart 
              data={categoryData}
              totalAmount={financialSummary.expenses}
            />
          </View>
        )}
      </ScrollView>
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={[styles.fab, SHADOWS.large]}
        onPress={handleAddTransaction}
      >
        <MaterialIcons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
  section: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  viewAllText: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  emptyText: {
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginVertical: 20,
  },
  addButton: {
    marginVertical: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default HomeScreen;
