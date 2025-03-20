import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

// Import components
import CategoryItem from '../components/CategoryItem';
import Button from '../components/Button';
import FormInput from '../components/FormInput';

// Import actions
import { 
  fetchCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory 
} from '../store/slices/categoriesSlice';

const CategoriesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { categories, status } = useSelector(state => state.categories);
  const { darkMode } = useSelector(state => state.theme);
  
  // Local state for category form
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('category');
  const [color, setColor] = useState(COLORS.primary);
  const [type, setType] = useState('expense');
  const [errors, setErrors] = useState({});
  
  // Available icons
  const icons = [
    'category', 'shopping-cart', 'restaurant', 'directions-car', 'home', 
    'movie', 'medical-services', 'school', 'work', 'fitness-center', 
    'local-grocery-store', 'local-cafe', 'local-bar', 'local-mall', 
    'local-atm', 'local-hospital', 'local-hotel', 'local-laundry-service',
    'local-parking', 'local-pharmacy', 'local-shipping', 'local-taxi',
    'attach-money', 'account-balance', 'credit-card', 'savings'
  ];
  
  // Available colors
  const colors = [
    COLORS.primary, COLORS.expense, COLORS.income, 
    COLORS.food, COLORS.transportation, COLORS.housing, 
    COLORS.entertainment, COLORS.medical, COLORS.salary,
    '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#00BCD4', 
    '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', 
    '#FF5722', '#795548', '#607D8B'
  ];
  
  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  
  // Filter categories by type
  const expenseCategories = categories.filter(c => c.type === 'expense');
  const incomeCategories = categories.filter(c => c.type === 'income');
  
  // Handle add category button
  const handleAddCategory = () => {
    setEditingCategory(null);
    setName('');
    setIcon('category');
    setColor(COLORS.primary);
    setType('expense');
    setErrors({});
    setShowForm(true);
  };
  
  // Handle edit category
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setIcon(category.icon || 'category');
    setColor(category.color || COLORS.primary);
    setType(category.type || 'expense');
    setErrors({});
    setShowForm(true);
  };
  
  // Handle delete category
  const handleDeleteCategory = (category) => {
    Alert.alert(
      'カテゴリの削除',
      `"${category.name}"を削除してもよろしいですか？このカテゴリに関連付けられた取引は影響を受けません。`,
      [
        { text: 'キャンセル', style: 'cancel' },
        { 
          text: '削除', 
          style: 'destructive',
          onPress: () => {
            dispatch(deleteCategory(category.id));
          }
        }
      ]
    );
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'カテゴリ名を入力してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle save category
  const handleSaveCategory = () => {
    if (!validateForm()) return;
    
    const categoryData = {
      name: name.trim(),
      icon,
      color,
      type,
    };
    
    if (editingCategory) {
      dispatch(updateCategory({ 
        id: editingCategory.id, 
        data: categoryData 
      }));
    } else {
      dispatch(addCategory(categoryData));
    }
    
    setShowForm(false);
  };
  
  // Render category form
  const renderCategoryForm = () => {
    return (
      <View style={styles.formContainer}>
        <View style={styles.formHeader}>
          <Text style={[
            styles.formTitle,
            { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
          ]}>
            {editingCategory ? 'カテゴリを編集' : '新規カテゴリ'}
          </Text>
          <TouchableOpacity onPress={() => setShowForm(false)}>
            <MaterialIcons 
              name="close" 
              size={24} 
              color={darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary} 
            />
          </TouchableOpacity>
        </View>
        
        <FormInput 
          label="カテゴリ名"
          value={name}
          onChangeText={setName}
          placeholder="カテゴリ名を入力"
          error={errors.name}
          required
        />
        
        <View style={styles.toggleContainer}>
          <Text style={[
            styles.label,
            { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
          ]}>
            タイプ:
          </Text>
          <View style={styles.toggleButtons}>
            <TouchableOpacity 
              style={[
                styles.toggleButton,
                type === 'expense' && { backgroundColor: COLORS.expense },
              ]}
              onPress={() => setType('expense')}
            >
              <Text style={[
                styles.toggleButtonText,
                type === 'expense' && { color: COLORS.surface },
              ]}>
                支出
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.toggleButton,
                type === 'income' && { backgroundColor: COLORS.income },
              ]}
              onPress={() => setType('income')}
            >
              <Text style={[
                styles.toggleButtonText,
                type === 'income' && { color: COLORS.surface },
              ]}>
                収入
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={[
          styles.label,
          { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
        ]}>
          アイコン:
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.iconsContainer}
        >
          {icons.map((iconName) => (
            <TouchableOpacity 
              key={iconName}
              style={[
                styles.iconButton,
                icon === iconName && { backgroundColor: color }
              ]}
              onPress={() => setIcon(iconName)}
            >
              <MaterialIcons 
                name={iconName} 
                size={24} 
                color={icon === iconName ? COLORS.surface : color} 
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <Text style={[
          styles.label,
          { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
        ]}>
          カラー:
        </Text>
        <View style={styles.colorsContainer}>
          {colors.map((colorValue) => (
            <TouchableOpacity 
              key={colorValue}
              style={[
                styles.colorButton,
                { backgroundColor: colorValue },
                color === colorValue && styles.selectedColorButton
              ]}
              onPress={() => setColor(colorValue)}
            />
          ))}
        </View>
        
        <Button 
          title={editingCategory ? '更新' : '保存'}
          icon={editingCategory ? 'update' : 'save'}
          onPress={handleSaveCategory}
          fullWidth
          style={styles.saveButton}
        />
      </View>
    );
  };
  
  // Render category list
  const renderCategoryList = (categoryType) => {
    const categoryList = categoryType === 'expense' ? expenseCategories : incomeCategories;
    const title = categoryType === 'expense' ? '支出カテゴリ' : '収入カテゴリ';
    const emptyText = categoryType === 'expense' ? '支出カテゴリがありません' : '収入カテゴリがありません';
    
    return (
      <View style={styles.categoryListContainer}>
        <Text style={[
          styles.sectionTitle,
          { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
        ]}>
          {title}
        </Text>
        
        {categoryList.length > 0 ? (
          <FlatList
            data={categoryList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.categoryItemContainer}>
                <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
                  <MaterialIcons 
                    name={item.icon || 'category'} 
                    size={24} 
                    color="#FFFFFF" 
                  />
                </View>
                <Text style={[
                  styles.categoryName,
                  { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
                ]}>
                  {item.name}
                </Text>
                <View style={styles.categoryActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleEditCategory(item)}
                  >
                    <MaterialIcons name="edit" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleDeleteCategory(item)}
                  >
                    <MaterialIcons name="delete" size={20} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            scrollEnabled={false}
          />
        ) : (
          <Text style={[
            styles.emptyText,
            { color: darkMode ? COLORS.textSecondaryDark : COLORS.textSecondary }
          ]}>
            {emptyText}
          </Text>
        )}
      </View>
    );
  };
  
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
          カテゴリ管理
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {showForm ? (
          renderCategoryForm()
        ) : (
          <>
            <Button 
              title="新規カテゴリを追加"
              icon="add"
              onPress={handleAddCategory}
              fullWidth
              style={styles.addButton}
            />
            
            {renderCategoryList('expense')}
            {renderCategoryList('income')}
          </>
        )}
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
  addButton: {
    marginVertical: 16,
  },
  categoryListContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  categoryItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 8,
    ...SHADOWS.small,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryName: {
    flex: 1,
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  categoryActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyText: {
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginVertical: 20,
  },
  formContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginVertical: 16,
    ...SHADOWS.medium,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
  },
  label: {
    fontSize: SIZES.medium,
    fontWeight: '500',
    marginBottom: 8,
  },
  toggleContainer: {
    marginBottom: 16,
  },
  toggleButtons: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
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
  iconsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 4,
  },
  selectedColorButton: {
    borderWidth: 2,
    borderColor: COLORS.textPrimary,
  },
  saveButton: {
    marginTop: 8,
  },
});

export default CategoriesScreen;
