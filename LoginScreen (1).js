import React, { useState, useEffect } from 'react';
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
import { loginUser, registerUser } from '../store/slices/authSlice';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  
  // Form state
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
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
    
    if (!isLogin && !displayName) {
      newErrors.displayName = '名前を入力してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle login
  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await dispatch(loginUser({ email, password })).unwrap();
    } catch (error) {
      Alert.alert('ログインエラー', error || 'ログインに失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle register
  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await dispatch(registerUser({ email, password, displayName })).unwrap();
    } catch (error) {
      Alert.alert('登録エラー', error || '登録に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle submit
  const handleSubmit = () => {
    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  };
  
  // Toggle between login and register
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.logoContainer}>
          <MaterialIcons name="account-balance-wallet" size={80} color={COLORS.primary} />
          <Text style={styles.appName}>My Money Manager</Text>
          <Text style={styles.appTagline}>シンプルな家計簿アプリ</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            {isLogin ? 'ログイン' : '新規登録'}
          </Text>
          
          {!isLogin && (
            <FormInput 
              label="名前"
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="あなたの名前"
              icon="person"
              error={errors.displayName}
              required
            />
          )}
          
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
          
          <Button 
            title={isLogin ? 'ログイン' : '登録'}
            icon={isLogin ? 'login' : 'person-add'}
            onPress={handleSubmit}
            fullWidth
            disabled={loading}
            style={styles.submitButton}
          />
          
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={toggleAuthMode}
          >
            <Text style={styles.toggleButtonText}>
              {isLogin ? 'アカウントをお持ちでない方はこちら' : 'すでにアカウントをお持ちの方はこちら'}
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
    justifyContent: 'center',
    padding: SIZES.padding * 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: SIZES.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 16,
  },
  appTagline: {
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding * 2,
    ...SHADOWS.medium,
  },
  formTitle: {
    fontSize: SIZES.xl,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 20,
  },
  toggleButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
});

export default LoginScreen;
