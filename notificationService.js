import { useEffect, useState } from 'react';
import { Platform, AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import { auth } from '../services/firebaseConfig';
import { budgetService, transactionService } from '../services/firebaseServices';
import { checkBudgetExceeded } from '../utils/dataUtils';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request notification permissions
export const requestNotificationPermissions = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF9800',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
};

// Schedule budget notification
export const scheduleBudgetNotification = async (budget, transactions) => {
  const isExceeded = checkBudgetExceeded(budget, transactions);
  
  if (isExceeded) {
    const categoryName = budget.category?.name || '全体';
    const amount = budget.amount;
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '予算超過アラート',
        body: `${categoryName}の予算(${amount}円)を超過しました。`,
        data: { budget },
      },
      trigger: null, // Send immediately
    });
  }
};

// Schedule daily reminder notification
export const scheduleDailyReminderNotification = async () => {
  // Cancel any existing notifications with the same identifier
  await Notifications.cancelScheduledNotificationAsync('daily-reminder');
  
  // Schedule for 8:00 PM
  const now = new Date();
  const scheduledTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    20, // 8 PM
    0,
    0
  );
  
  // If it's already past 8 PM, schedule for tomorrow
  if (now > scheduledTime) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '記録リマインダー',
      body: '今日の収支を記録しましょう！',
    },
    trigger: {
      hour: 20,
      minute: 0,
      repeats: true,
    },
    identifier: 'daily-reminder',
  });
};

// Custom hook for notification management
export const useNotifications = () => {
  const [notification, setNotification] = useState(null);
  
  useEffect(() => {
    // Request permissions
    requestNotificationPermissions();
    
    // Schedule daily reminder
    scheduleDailyReminderNotification();
    
    // Listen for notifications
    const notificationListener = Notifications.addNotificationReceivedListener(
      notification => {
        setNotification(notification);
      }
    );
    
    // Listen for user interaction with notification
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log(response);
      }
    );
    
    // Check budgets when app comes to foreground
    const appStateListener = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checkBudgets();
      }
    });
    
    // Cleanup
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
      appStateListener.remove();
    };
  }, []);
  
  // Check all budgets and send notifications if exceeded
  const checkBudgets = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      
      const budgets = await budgetService.getBudgets(userId);
      const transactions = await transactionService.getTransactions(userId);
      
      for (const budget of budgets) {
        await scheduleBudgetNotification(budget, transactions);
      }
    } catch (error) {
      console.error('Error checking budgets:', error);
    }
  };
  
  return { notification, checkBudgets };
};
