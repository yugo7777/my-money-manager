import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const FinancialSummary = ({
  income,
  expenses,
  balance,
  period = '今月',
  onPress,
}) => {
  // Format currency
  const formatCurrency = (amount) => {
    return amount.toLocaleString('ja-JP') + '円';
  };

  // Determine balance color
  const balanceColor = balance >= 0 ? COLORS.success : COLORS.error;

  return (
    <TouchableOpacity 
      style={[styles.container, SHADOWS.medium]} 
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{period}の収支</Text>
        <MaterialIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>残高</Text>
        <Text style={[styles.balanceAmount, { color: balanceColor }]}>
          {formatCurrency(balance)}
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <View style={[styles.iconContainer, { backgroundColor: COLORS.income }]}>
            <MaterialIcons name="arrow-upward" size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.detailLabel}>収入</Text>
          <Text style={[styles.detailAmount, { color: COLORS.income }]}>
            {formatCurrency(income)}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <View style={[styles.iconContainer, { backgroundColor: COLORS.expense }]}>
            <MaterialIcons name="arrow-downward" size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.detailLabel}>支出</Text>
          <Text style={[styles.detailAmount, { color: COLORS.expense }]}>
            {formatCurrency(expenses)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: SIZES.medium,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: SIZES.xxxl,
    fontWeight: '700',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  detailLabel: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  detailAmount: {
    fontSize: SIZES.medium,
    fontWeight: '600',
  },
});

export default FinancialSummary;
