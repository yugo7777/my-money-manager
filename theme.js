export const COLORS = {
  // Primary colors
  primary: '#2196F3',
  primaryDark: '#1976D2',
  primaryLight: '#BBDEFB',
  
  // Income colors (blue tones)
  income: '#2196F3',
  incomeLight: '#90CAF9',
  incomeDark: '#0D47A1',
  
  // Expense colors (orange tones)
  expense: '#FF9800',
  expenseLight: '#FFCC80',
  expenseDark: '#E65100',
  
  // Category colors
  food: '#FF5722',
  transportation: '#4CAF50',
  housing: '#9C27B0',
  entertainment: '#FFEB3B',
  medical: '#F44336',
  salary: '#2196F3',
  
  // UI colors
  background: '#FFFFFF',
  backgroundDark: '#121212',
  surface: '#FFFFFF',
  surfaceDark: '#1E1E1E',
  
  // Text colors
  textPrimary: '#212121',
  textSecondary: '#757575',
  textPrimaryDark: '#FFFFFF',
  textSecondaryDark: '#B0B0B0',
  
  // Status colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  info: '#2196F3',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

export const SIZES = {
  // Font sizes
  xs: 10,
  small: 12,
  medium: 14,
  large: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  
  // Spacing
  padding: 16,
  margin: 16,
  radius: 8,
};

export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 6,
  },
};

export default { COLORS, FONTS, SIZES, SHADOWS };
