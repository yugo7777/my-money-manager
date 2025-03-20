import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import SettingsScreen from '../src/screens/SettingsScreen';

// Mock the navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Mock Linking
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
}));

// Create mock store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('SettingsScreen', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: { uid: 'test-user-id', email: 'test@example.com', displayName: 'Test User' },
      },
      theme: {
        darkMode: false,
      },
    });
    
    // Clear navigation mocks
    mockNavigation.navigate.mockClear();
  });

  it('renders correctly with user data', () => {
    const { getByText } = render(
      <Provider store={store}>
        <SettingsScreen navigation={mockNavigation} />
      </Provider>
    );

    // Check if important elements are rendered
    expect(getByText('設定')).toBeTruthy();
    expect(getByText('Test User')).toBeTruthy();
    expect(getByText('test@example.com')).toBeTruthy();
    expect(getByText('外観')).toBeTruthy();
    expect(getByText('ダークモード')).toBeTruthy();
    expect(getByText('通知')).toBeTruthy();
    expect(getByText('データ管理')).toBeTruthy();
    expect(getByText('アプリについて')).toBeTruthy();
    expect(getByText('ログアウト')).toBeTruthy();
  });

  it('toggles dark mode when switch is pressed', () => {
    const { getByText } = render(
      <Provider store={store}>
        <SettingsScreen navigation={mockNavigation} />
      </Provider>
    );

    // Find and toggle dark mode switch
    const darkModeSwitch = getByText('ダークモード').parent.parent.children[2];
    fireEvent(darkModeSwitch, 'valueChange', true);

    // Check if action was dispatched
    const actions = store.getActions();
    expect(actions[0].type).toBe('theme/toggleTheme');
  });

  it('shows alert when backup button is pressed', () => {
    const { getByText } = render(
      <Provider store={store}>
        <SettingsScreen navigation={mockNavigation} />
      </Provider>
    );

    // Find and press backup button
    fireEvent.press(getByText('データのバックアップ'));

    // Check if Alert.alert was called
    expect(require('react-native/Libraries/Alert/Alert').alert).toHaveBeenCalledWith(
      'データのバックアップ',
      'すべてのデータをFirebaseにバックアップしますか？',
      expect.any(Array)
    );
  });

  it('shows alert when restore button is pressed', () => {
    const { getByText } = render(
      <Provider store={store}>
        <SettingsScreen navigation={mockNavigation} />
      </Provider>
    );

    // Find and press restore button
    fireEvent.press(getByText('データの復元'));

    // Check if Alert.alert was called
    expect(require('react-native/Libraries/Alert/Alert').alert).toHaveBeenCalledWith(
      'データの復元',
      'バックアップからデータを復元しますか？現在のデータは上書きされます。',
      expect.any(Array)
    );
  });

  it('shows alert when export button is pressed', () => {
    const { getByText } = render(
      <Provider store={store}>
        <SettingsScreen navigation={mockNavigation} />
      </Provider>
    );

    // Find and press export button
    fireEvent.press(getByText('データのエクスポート'));

    // Check if Alert.alert was called
    expect(require('react-native/Libraries/Alert/Alert').alert).toHaveBeenCalledWith(
      'データのエクスポート',
      'すべての取引データをCSV形式でエクスポートしますか？',
      expect.any(Array)
    );
  });

  it('opens privacy policy when link is pressed', () => {
    const { getByText } = render(
      <Provider store={store}>
        <SettingsScreen navigation={mockNavigation} />
      </Provider>
    );

    // Find and press privacy policy link
    fireEvent.press(getByText('プライバシーポリシー'));

    // Check if Linking.openURL was called
    expect(require('react-native/Libraries/Linking/Linking').openURL).toHaveBeenCalledWith(
      'https://example.com/privacy'
    );
  });

  it('shows logout confirmation when logout button is pressed', () => {
    const { getByText } = render(
      <Provider store={store}>
        <SettingsScreen navigation={mockNavigation} />
      </Provider>
    );

    // Find and press logout button
    fireEvent.press(getByText('ログアウト'));

    // Check if Alert.alert was called
    expect(require('react-native/Libraries/Alert/Alert').alert).toHaveBeenCalledWith(
      'ログアウト',
      'ログアウトしてもよろしいですか？',
      expect.any(Array)
    );
  });
});
