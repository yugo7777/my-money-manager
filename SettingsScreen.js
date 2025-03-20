import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
  Linking
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

// Import components
import Button from '../components/Button';

// Import actions
import { toggleTheme } from '../store/slices/themeSlice';
import { logoutUser } from '../store/slices/authSlice';

// Import services
import { dataService } from '../services/firebaseServices';
import { requestNotificationPermissions, scheduleDailyReminderNotification } from '../services/notificationService';

const SettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { darkMode } = useSelector(state => state.theme);
  
  // Local state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(true);
  const [budgetAlertsEnabled, setBudgetAlertsEnabled] = useState(true);
  
  // Handle theme toggle
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };
  
  // Handle notification toggle
  const handleToggleNotifications = async (value) => {
    if (value) {
      const permissionGranted = await requestNotificationPermissions();
      if (!permissionGranted) {
        Alert.alert(
          '通知の許可が必要です',
          '設定アプリから通知の許可を有効にしてください。',
          [{ text: 'OK' }]
        );
        return;
      }
    }
    
    setNotificationsEnabled(value);
    
    // If turning off notifications, also turn off specific notification types
    if (!value) {
      setDailyReminderEnabled(false);
      setBudgetAlertsEnabled(false);
    }
  };
  
  // Handle daily reminder toggle
  const handleToggleDailyReminder = async (value) => {
    if (value && !notificationsEnabled) {
      Alert.alert(
        '通知が無効です',
        'まず通知を有効にしてください。',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setDailyReminderEnabled(value);
    
    if (value) {
      await scheduleDailyReminderNotification();
    } else {
      // Cancel daily reminder (would be implemented in a real app)
    }
  };
  
  // Handle budget alerts toggle
  const handleToggleBudgetAlerts = (value) => {
    if (value && !notificationsEnabled) {
      Alert.alert(
        '通知が無効です',
        'まず通知を有効にしてください。',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setBudgetAlertsEnabled(value);
  };
  
  // Handle backup data
  const handleBackupData = () => {
    Alert.alert(
      'データのバックアップ',
      'すべてのデータをFirebaseにバックアップしますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        { 
          text: 'バックアップ', 
          onPress: () => {
            // This would be implemented in a real app
            Alert.alert('バックアップ完了', 'データが正常にバックアップされました。');
          }
        }
      ]
    );
  };
  
  // Handle restore data
  const handleRestoreData = () => {
    Alert.alert(
      'データの復元',
      'バックアップからデータを復元しますか？現在のデータは上書きされます。',
      [
        { text: 'キャンセル', style: 'cancel' },
        { 
          text: '復元', 
          onPress: () => {
            // This would be implemented in a real app
            Alert.alert('復元完了', 'データが正常に復元されました。');
          }
        }
      ]
    );
  };
  
  // Handle export data
  const handleExportData = () => {
    Alert.alert(
      'データのエクスポート',
      'すべての取引データをCSV形式でエクスポートしますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        { 
          text: 'エクスポート', 
          onPress: () => {
            // This would be implemented in a real app
            Alert.alert('エクスポート完了', 'データが正常にエクスポートされました。');
          }
        }
      ]
    );
  };
  
  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'ログアウト',
      'ログアウトしてもよろしいですか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        { 
          text: 'ログアウト', 
          style: 'destructive',
          onPress: () => {
            dispatch(logoutUser());
          }
        }
      ]
    );
  };
  
  // Render setting item
  const renderSettingItem = ({ icon, title, description, action, isSwitch, value, onValueChange }) => {
    return (
      <View style={[styles.settingItem, SHADOWS.small]}>
        <View style={styles.settingIconContainer}>
          <MaterialIcons 
            name={icon} 
            size={24} 
            color={darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary} 
          />
        </View>
        <View style={styles.settingContent}>
          <Text style={[
            styles.settingTitle,
            { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
          ]}>
            {title}
          </Text>
          {description && (
            <Text style={[
              styles.settingDescription,
              { color: darkMode ? COLORS.textSecondaryDark : COLORS.textSecondary }
            ]}>
              {description}
            </Text>
          )}
        </View>
        {isSwitch ? (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#767577', true: COLORS.primaryLight }}
            thumbColor={value ? COLORS.primary : '#f4f3f4'}
          />
        ) : (
          <TouchableOpacity onPress={action}>
            <MaterialIcons 
              name="chevron-right" 
              size={24} 
              color={darkMode ? COLORS.textSecondaryDark : COLORS.textSecondary} 
            />
          </TouchableOpacity>
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
          設定
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile */}
        <View style={[styles.profileContainer, SHADOWS.medium]}>
          <View style={styles.profileIconContainer}>
            <MaterialIcons name="person" size={40} color="#FFFFFF" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[
              styles.profileName,
              { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
            ]}>
              {user?.displayName || 'ユーザー'}
            </Text>
            <Text style={[
              styles.profileEmail,
              { color: darkMode ? COLORS.textSecondaryDark : COLORS.textSecondary }
            ]}>
              {user?.email || 'email@example.com'}
            </Text>
          </View>
        </View>
        
        {/* Appearance Settings */}
        <View style={styles.settingSection}>
          <Text style={[
            styles.sectionTitle,
            { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
          ]}>
            外観
          </Text>
          
          {renderSettingItem({
            icon: 'brightness-6',
            title: 'ダークモード',
            description: 'アプリの外観を暗くします',
            isSwitch: true,
            value: darkMode,
            onValueChange: handleToggleTheme
          })}
        </View>
        
        {/* Notification Settings */}
        <View style={styles.settingSection}>
          <Text style={[
            styles.sectionTitle,
            { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
          ]}>
            通知
          </Text>
          
          {renderSettingItem({
            icon: 'notifications',
            title: '通知',
            description: 'アプリからの通知を有効にします',
            isSwitch: true,
            value: notificationsEnabled,
            onValueChange: handleToggleNotifications
          })}
          
          {renderSettingItem({
            icon: 'access-time',
            title: '毎日のリマインダー',
            description: '毎日20:00に記録のリマインダーを送信',
            isSwitch: true,
            value: dailyReminderEnabled,
            onValueChange: handleToggleDailyReminder
          })}
          
          {renderSettingItem({
            icon: 'warning',
            title: '予算超過アラート',
            description: '予算を超えた場合に通知',
            isSwitch: true,
            value: budgetAlertsEnabled,
            onValueChange: handleToggleBudgetAlerts
          })}
        </View>
        
        {/* Data Management */}
        <View style={styles.settingSection}>
          <Text style={[
            styles.sectionTitle,
            { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
          ]}>
            データ管理
          </Text>
          
          {renderSettingItem({
            icon: 'backup',
            title: 'データのバックアップ',
            description: 'Firebaseにデータをバックアップ',
            action: handleBackupData
          })}
          
          {renderSettingItem({
            icon: 'restore',
            title: 'データの復元',
            description: 'バックアップからデータを復元',
            action: handleRestoreData
          })}
          
          {renderSettingItem({
            icon: 'file-download',
            title: 'データのエクスポート',
            description: '取引データをCSV形式でエクスポート',
            action: handleExportData
          })}
        </View>
        
        {/* About */}
        <View style={styles.settingSection}>
          <Text style={[
            styles.sectionTitle,
            { color: darkMode ? COLORS.textPrimaryDark : COLORS.textPrimary }
          ]}>
            アプリについて
          </Text>
          
          {renderSettingItem({
            icon: 'info',
            title: 'アプリ情報',
            description: 'バージョン 1.0.0',
            action: () => {}
          })}
          
          {renderSettingItem({
            icon: 'description',
            title: 'プライバシーポリシー',
            action: () => Linking.openURL('https://example.com/privacy')
          })}
          
          {renderSettingItem({
            icon: 'help',
            title: 'ヘルプ',
            action: () => Linking.openURL('https://example.com/help')
          })}
        </View>
        
        {/* Logout Button */}
        <Button 
          title="ログアウト"
          icon="exit-to-app"
          type="outline"
          onPress={handleLogout}
          fullWidth
          style={styles.logoutButton}
        />
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
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 24,
  },
  profileIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: SIZES.large,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
  },
  settingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: SIZES.large,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 8,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: SIZES.medium,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    marginVertical: 20,
  },
});

export default SettingsScreen;
