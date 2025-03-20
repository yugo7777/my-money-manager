import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const CategoryItem = ({ 
  category, 
  onPress,
  selected = false,
}) => {
  const { 
    name, 
    icon, 
    color, 
    type 
  } = category;
  
  const backgroundColor = selected ? color : COLORS.surface;
  const textColor = selected ? COLORS.surface : COLORS.textPrimary;
  const iconColor = selected ? COLORS.surface : color;
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        SHADOWS.small,
        { backgroundColor }
      ]} 
      onPress={() => onPress(category)}
    >
      <View style={[styles.iconContainer, { backgroundColor: selected ? COLORS.surface : color }]}>
        <MaterialIcons 
          name={icon || (type === 'income' ? 'attach-money' : 'category')} 
          size={24} 
          color={iconColor} 
        />
      </View>
      
      <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginRight: 10,
    marginBottom: 10,
    width: 80,
    height: 80,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: SIZES.small,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default CategoryItem;
