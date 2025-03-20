import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import store and navigation
import store from './src/store';
import AppNavigator from './src/navigation/AppNavigator';

// Import Firebase auth listener
import FirebaseAuthListener from './src/services/FirebaseAuthListener';

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <SafeAreaProvider>
          <FirebaseAuthListener>
            <AppNavigator />
          </FirebaseAuthListener>
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </PaperProvider>
    </Provider>
  );
}
