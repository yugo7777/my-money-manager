import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import LoginScreen from '../src/screens/LoginScreen';

// Mock the navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Create mock store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('LoginScreen', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: null,
        status: 'idle',
        error: null,
        isAuthenticated: false,
      },
    });
    
    // Clear navigation mocks
    mockNavigation.navigate.mockClear();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <LoginScreen navigation={mockNavigation} />
      </Provider>
    );

    // Check if important elements are rendered
    expect(getByText('ログイン')).toBeTruthy();
    expect(getByPlaceholderText('your@email.com')).toBeTruthy();
    expect(getByPlaceholderText('6文字以上')).toBeTruthy();
    expect(getByText('アカウントをお持ちでない方はこちら')).toBeTruthy();
  });

  it('shows validation errors when form is submitted with empty fields', () => {
    const { getByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={mockNavigation} />
      </Provider>
    );

    // Submit the form
    fireEvent.press(getByText('ログイン'));

    // Check if validation errors are shown
    expect(getByText('メールアドレスを入力してください')).toBeTruthy();
    expect(getByText('パスワードを入力してください')).toBeTruthy();
  });

  it('dispatches loginUser action when form is valid', async () => {
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <LoginScreen navigation={mockNavigation} />
      </Provider>
    );

    // Fill the form
    fireEvent.changeText(getByPlaceholderText('your@email.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('6文字以上'), 'password123');

    // Submit the form
    fireEvent.press(getByText('ログイン'));

    // Check if the action was dispatched
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions[0].type).toBe('auth/loginUser/pending');
    });
  });

  it('toggles between login and register mode', () => {
    const { getByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={mockNavigation} />
      </Provider>
    );

    // Initially in login mode
    expect(getByText('ログイン')).toBeTruthy();
    expect(getByText('アカウントをお持ちでない方はこちら')).toBeTruthy();

    // Toggle to register mode
    fireEvent.press(getByText('アカウントをお持ちでない方はこちら'));

    // Now in register mode
    expect(getByText('登録')).toBeTruthy();
    expect(getByText('すでにアカウントをお持ちの方はこちら')).toBeTruthy();
  });
});
