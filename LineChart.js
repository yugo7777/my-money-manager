import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryLegend, VictoryTheme } from 'victory-native';
import { COLORS, SIZES } from '../constants/theme';

const LineChart = ({
  data,
  width = 350,
  height = 250,
  title,
  xAxisLabel,
  yAxisLabel,
}) => {
  // Format data for VictoryLine
  const incomeData = data.map(item => ({
    x: item.date || item.month,
    y: item.income,
  }));

  const expenseData = data.map(item => ({
    x: item.date || item.month,
    y: item.expenses,
  }));

  // Format currency
  const formatCurrency = (amount) => {
    return amount.toLocaleString('ja-JP') + '円';
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      <VictoryChart
        width={width}
        height={height}
        theme={VictoryTheme.material}
        domainPadding={{ x: 20 }}
      >
        <VictoryAxis
          tickFormat={(x) => x}
          style={{
            axisLabel: { fontSize: SIZES.small, padding: 30 },
            tickLabels: { fontSize: SIZES.xs, angle: -45 },
          }}
          label={xAxisLabel}
        />
        
        <VictoryAxis
          dependentAxis
          tickFormat={(y) => `${y / 1000}k`}
          style={{
            axisLabel: { fontSize: SIZES.small, padding: 40 },
            tickLabels: { fontSize: SIZES.xs },
          }}
          label={yAxisLabel}
        />
        
        <VictoryLine
          data={incomeData}
          style={{
            data: { stroke: COLORS.income, strokeWidth: 2 },
          }}
        />
        
        <VictoryLine
          data={expenseData}
          style={{
            data: { stroke: COLORS.expense, strokeWidth: 2 },
          }}
        />
        
        <VictoryLegend
          x={width / 2 - 100}
          y={0}
          orientation="horizontal"
          gutter={20}
          style={{ 
            labels: { fontSize: SIZES.small } 
          }}
          data={[
            { name: '収入', symbol: { fill: COLORS.income } },
            { name: '支出', symbol: { fill: COLORS.expense } },
          ]}
        />
      </VictoryChart>
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
});

export default LineChart;
