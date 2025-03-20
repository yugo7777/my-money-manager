import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

// Import components
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import CategoryItem from '../components/CategoryItem';

// Import actions
import { addTransaction, updateTransaction } from '../store/slices/transactionsSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';

const TransactionFormScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.categories);
  const { darkMode } = useSelector(state => state.theme);
  
  // Get transaction from route params if editing
  const editingTransaction = route.params?.transaction;
  const isEditing = !!editingTransaction;
  
  // Form state
  const [type, setType] = useState(editingTransaction?.type || 'expense');
  const [amount, setAmount] = useState(editingTransaction?.amount?.toString() || '');
  const [date, setDate] = useState(new Date(editingTransaction?.date || new Date()));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categoryId, setCategoryId] = useState(editingTransaction?.categoryId || '');
  const [memo, setMemo] = useState(editingTransaction?.memo || '');
  const [receiptImage, setReceiptImage] = useState(editingTransaction?.receiptUrl || null);
  
  // Errors state
  const [errors, setErrors] = useState({});
  
  // Fetch categories if needed
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);
  
  // Filter categories by type
  const filteredCategories = categories.filter(category => category.type === type);
  
  // Handle type toggle
  const handleTypeToggle = () => {
    const newType = type === 'expense' ? 'income' : 'expense';
    setType(newType);
    setCategoryId(''); // Reset category when type changes
  };
  
  // Handle date change
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
  
  // Handle category selection
  const handleCategorySelect = (category) => {
    setCategoryId(category.id);
  };
  
  // Handle image picker
  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert('カメラロールへのアクセス許可が必要です');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setReceiptImage(result.assets[0].uri);
    }
  };
  
  // Handle camera
  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert('カメラへのアクセス許可が必要です');
      return;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setReceiptImage(result.assets[0].uri);
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!amount) {
      newErrors.amount = '金額を入力してください';
    } else if (isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = '有効な金額を入力してください';
    }
    
    if (!categoryId) {
      newErrors.category = 'カテゴリを選択してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle save
  const handleSave = () => {
    if (!validateForm()) return;
    
    const transactionData = {
      type,
      amount: parseFloat(amount),
      date: date.toISOString(),
      categoryId,
      memo,
      receiptUrl: receiptImage,
      // Add the category object for easier display
      category: categories.find(c => c.id === categoryId),
    };
    
    if (isEditing) {
      dispatch(updateTransaction({ 
        id: editingTransaction.id, 
        data: transactionData 
      }));
    } else {
      dispatch(addTransaction(transactionData));
    }
    
    navigation.goBack();
  };
  
  return (
    <SafeAreaView style={[
      styles.container, 
      { backgroundColor: darkMode ? COLORS.backgroundDark : COLORS.background }
    ]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons 
              name="arrow-back" 
              size={24} 
              color={darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary} 
            />
          </TouchableOpacity>
          <Text style={[
            styles.headerTitle,
            { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
          ]}>
            {isEditing ? '取引を編集' : '新規取引'}
          </Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Transaction Type Toggle */}
          <View style={styles.toggleContainer}>
            <Text style={[
              styles.toggleLabel,
              { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
            ]}>
              取引タイプ:
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
          
          {/* Amount Input */}
          <FormInput 
            label="金額"
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            keyboardType="numeric"
            icon="attach-money"
            error={errors.amount}
            required
          />
          
          {/* Date Picker */}
          <View style={styles.dateContainer}>
            <Text style={[
              styles.label,
              { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
            ]}>
              日付
            </Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <MaterialIcons name="calendar-today" size={20} color={COLORS.textSecondary} />
              <Text style={styles.dateText}>
                {format(date, 'yyyy/MM/dd')}
              </Text>
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
          
          {/* Category Selection */}
          <View style={styles.categorySection}>
            <View style={styles.sectionHeader}>
              <Text style={[
                styles.label,
                { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
              ]}>
                カテゴリ
              </Text>
              {errors.category && (
                <Text style={styles.errorText}>{errors.category}</Text>
              )}
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesContainer}
            >
              {filteredCategories.map((category) => (
                <CategoryItem 
                  key={category.id}
                  category={category}
                  onPress={handleCategorySelect}
                  selected={category.id === categoryId}
                />
              ))}
            </ScrollView>
          </View>
          
          {/* Memo Input */}
          <FormInput 
            label="メモ"
            value={memo}
            onChangeText={setMemo}
            placeholder="メモを入力（任意）"
            icon="note"
            multiline
            numberOfLines={3}
          />
          
          {/* Receipt Image */}
          <View style={styles.receiptSection}>
            <Text style={[
              styles.label,
              { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
            ]}>
              レシート画像（任意）
            </Text>
            
            <View style={styles.imageButtonsContainer}>
              <Button 
                title="ギャラリーから選択"
                icon="photo-library"
                type="outline"
                size="small"
                onPress={handlePickImage}
                style={styles.imageButton}
              />
              <Button 
                title="カメラで撮影"
                icon="camera-alt"
                type="outline"
                size="small"
                onPress={handleTakePhoto}
                style={styles.imageButton}
              />
            </View>
            
            {receiptImage && (
              <View style={styles.imagePreviewContainer}>
                <Image 
                  source={{ uri: receiptImage }} 
                  style={styles.imagePreview} 
                />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setReceiptImage(null)}
                >
                  <MaterialIcons name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          {/* Save Button */}
          <Button 
            title={isEditing ? '更新' : '保存'}
            icon={isEditing ? 'update' : 'save'}
            onPress={handleSave}
            fullWidth
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  toggleContainer: {
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: SIZES.medium,
    fontWeight: '500',
    marginBottom: 8,
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
  dateContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: SIZES.medium,
    fontWeight: '500',
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    borderRadius: SIZES.radius,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateText: {
    fontSize: SIZES.medium,
    marginLeft: 8,
  },
  categorySection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.small,
  },
  receiptSection: {
    marginBottom: 16,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  imageButton: {
    flex: 1,
    marginRight: 8,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: SIZES.radius,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    marginVertical: 20,
  },
});

export default TransactionFormScreen;
