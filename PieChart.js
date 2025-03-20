import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VictoryPie, VictoryLabel } from 'victory-native';
import { COLORS, SIZES } from '../constants/theme';

const PieChart = ({
  data,
  width = 300,
  height = 300,
  innerRadius = 60,
  title,
  totalAmount,
}) => {
  // Format data for VictoryPie
  const chartData = data.map(item => ({
    x: item.name,
    y: item.total,
    color: item.color,
  }));

  // Format currency
  const formatCurrency = (amount) => {
    return amount.toLocaleString('ja-JP') + '円';
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      <View style={styles.chartContainer}>
        <VictoryPie
          data={chartData}
          width={width}
          height={height}
          innerRadius={innerRadius}
          padAngle={2}
          style={{
            data: {
              fill: ({ datum }) => datum.color,
            },
          }}
          labelComponent={<VictoryLabel style={{ fontSize: 0 }} />}
        />
        
        {totalAmount !== undefined && (
          <View style={styles.centerLabel}>
            <Text style={styles.centerLabelTitle}>合計</Text>
            <Text style={styles.centerLabelAmount}>{formatCurrency(totalAmount)}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.legendContainer}>
        {chartData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.x}</Text>
            <Text style={styles.legendValue}>{formatCurrency(item.y)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  title: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  chartContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabelTitle: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  centerLabelAmount: {
    fontSize: SIZES.medium,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  legendContainer: {
    width: '100%',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
  },
  legendValue: {
    fontSize: SIZES.medium,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
});

export default PieChart;
