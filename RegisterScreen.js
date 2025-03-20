import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert
} from 'react-native';
import { useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

// Import components
import Button from '../components/Button';
import FormInput from '../components/FormInput';

// Import actions
import { registerUser } from '../store/slices/authSlice';

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!displayName) {
      newErrors.displayName = '名前を入力してください';
    }
    
    if (!email) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }
    
    if (!password) {
      newErrors.password = 'パスワードを入力してください';
    } else if (password.length < 6) {
      newErrors.password = 'パスワードは6文字以上で入力してください';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'パスワードを再入力してください';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle register
  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await dispatch(registerUser({ email, password, displayName })).unwrap();
      // Registration successful, navigation will be handled by the auth state change
    } catch (error) {
      Alert.alert('登録エラー', error || '登録に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };
  
  // Go to login screen
  const goToLogin = () => {
    navigation.navigate('Login');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={goToLogin}>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>アカウント作成</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.formContainer}>
          <FormInput 
            label="名前"
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="あなたの名前"
            icon="person"
            error={errors.displayName}
            required
          />
          
          <FormInput 
            label="メールアドレス"
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            icon="email"
            keyboardType="email-address"
            error={errors.email}
            required
          />
          
          <FormInput 
            label="パスワード"
            value={password}
            onChangeText={setPassword}
            placeholder="6文字以上"
            icon="lock"
            secureTextEntry
            error={errors.password}
            required
          />
          
          <FormInput 
            label="パスワード（確認）"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="パスワードを再入力"
            icon="lock"
            secureTextEntry
            error={errors.confirmPassword}
            required
          />
          
          <Button 
            title="登録"
            icon="person-add"
            onPress={handleRegister}
            fullWidth
            disabled={loading}
            style={styles.registerButton}
          />
          
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={goToLogin}
          >
            <Text style={styles.loginButtonText}>
              すでにアカウントをお持ちの方はこちら
            </Text>
          </TouchableOpacity>
        </View>
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
    color: COLORS.textPrimary,
  },
  formContainer: {
    flex: 1,
    padding: SIZES.padding * 2,
  },
  registerButton: {
    marginTop: 20,
  },
  loginButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
});

export default RegisterScreen;
