import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import Firebase auth
import { auth } from './firebaseConfig';

// Import actions
import { setUser } from '../store/slices/authSlice';
import { setTheme } from '../store/slices/themeSlice';

const FirebaseAuthListener = ({ children }) => {
  const dispatch = useDispatch();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Load theme preference from AsyncStorage
    const loadThemePreference = async () => {
      try {
        const darkMode = await AsyncStorage.getItem('darkMode');
        if (darkMode !== null) {
          dispatch(setTheme(JSON.parse(darkMode)));
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };

    loadThemePreference();

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          })
        );
      } else {
        // User is signed out
        dispatch(setUser(null));
      }
      
      if (initializing) {
        setInitializing(false);
      }
    });

    // Cleanup subscription
    return unsubscribe;
  }, [dispatch, initializing]);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return children;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 18,
    color: '#2196F3',
  },
});

export default FirebaseAuthListener;
