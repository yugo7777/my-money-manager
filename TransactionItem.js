import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const TransactionItem = ({ 
  transaction, 
  onPress,
  showCategory = true,
}) => {
  const { 
    type, 
    amount, 
    category, 
    date, 
    memo 
  } = transaction;
  
  const isIncome = type === 'income';
  const amountColor = isIncome ? COLORS.income : COLORS.expense;
  const sign = isIncome ? '+' : '-';
  
  // Format date to display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP');
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, SHADOWS.small]} 
      onPress={() => onPress(transaction)}
    >
      {/* Category Icon */}
      {showCategory && (
        <View 
          style={[
            styles.iconContainer, 
            { backgroundColor: category?.color || (isIncome ? COLORS.incomeLight : COLORS.expenseLight) }
          ]}
        >
          <MaterialIcons 
            name={category?.icon || (isIncome ? 'attach-money' : 'money-off')} 
            size={24} 
            color="#FFFFFF" 
          />
        </View>
      )}
      
      {/* Transaction Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.row}>
          <Text style={styles.title} numberOfLines={1}>
            {category?.name || (isIncome ? '収入' : '支出')}
          </Text>
          <Text style={[styles.amount, { color: amountColor }]}>
            {sign} {amount.toLocaleString()} 円
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.date}>{formatDate(date)}</Text>
          {memo ? (
            <Text style={styles.memo} numberOfLines={1}>
              {memo}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: SIZES.medium,
    fontWeight: '500',
    color: COLORS.textPrimary,
    flex: 1,
  },
  amount: {
    fontSize: SIZES.large,
    fontWeight: '600',
  },
  date: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  memo: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    flex: 1,
    textAlign: 'right',
  },
});

export default TransactionItem;
