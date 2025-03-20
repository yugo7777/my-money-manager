import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import TransactionFormScreen from '../src/screens/TransactionFormScreen';

// Mock the navigation and route
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

const mockRoute = {
  params: {},
};

// Create mock store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

// Mock expo-image-picker
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'images',
  },
}));

// Mock date-fns
jest.mock('date-fns', () => ({
  format: jest.fn().mockReturnValue('2025/03/20'),
}));

describe('TransactionFormScreen', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      categories: {
        categories: [
          { id: '1', name: 'Food', icon: 'restaurant', color: '#FF5722', type: 'expense' },
          { id: '2', name: 'Transportation', icon: 'directions-car', color: '#4CAF50', type: 'expense' },
          { id: '3', name: 'Salary', icon: 'attach-money', color: '#2196F3', type: 'income' },
        ],
        status: 'succeeded',
      },
      theme: {
        darkMode: false,
      },
    });
    
    // Clear navigation mocks
    mockNavigation.navigate.mockClear();
    mockNavigation.goBack.mockClear();
  });

  it('renders correctly for new transaction', () => {
    const { getByText, getAllByText } = render(
      <Provider store={store}>
        <TransactionFormScreen navigation={mockNavigation} route={mockRoute} />
      </Provider>
    );

    // Check if important elements are rendered
    expect(getByText('新規取引')).toBeTruthy();
    expect(getByText('取引タイプ:')).toBeTruthy();
    expect(getByText('支出')).toBeTruthy();
    expect(getByText('収入')).toBeTruthy();
    expect(getByText('金額')).toBeTruthy();
    expect(getByText('日付')).toBeTruthy();
    expect(getByText('カテゴリ')).toBeTruthy();
    expect(getByText('メモ')).toBeTruthy();
    expect(getByText('レシート画像（任意）')).toBeTruthy();
    expect(getByText('保存')).toBeTruthy();
  });

  it('renders correctly for editing transaction', () => {
    const mockRouteWithTransaction = {
      params: {
        transaction: {
          id: '123',
          type: 'expense',
          amount: 1000,
          date: '2025-03-20T00:00:00.000Z',
          categoryId: '1',
          memo: 'Test memo',
        },
      },
    };

    const { getByText } = render(
      <Provider store={store}>
        <TransactionFormScreen navigation={mockNavigation} route={mockRouteWithTransaction} />
      </Provider>
    );

    // Check if important elements are rendered for editing
    expect(getByText('取引を編集')).toBeTruthy();
    expect(getByText('更新')).toBeTruthy();
  });

  it('shows validation errors when form is submitted with empty fields', () => {
    const { getByText } = render(
      <Provider store={store}>
        <TransactionFormScreen navigation={mockNavigation} route={mockRoute} />
      </Provider>
    );

    // Submit the form
    fireEvent.press(getByText('保存'));

    // Check if validation errors are shown
    expect(getByText('金額を入力してください')).toBeTruthy();
    expect(getByText('カテゴリを選択してください')).toBeTruthy();
  });

  it('dispatches addTransaction action when form is valid', async () => {
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <TransactionFormScreen navigation={mockNavigation} route={mockRoute} />
      </Provider>
    );

    // Fill the form
    fireEvent.changeText(getByPlaceholderText('0'), '1000');
    
    // Select a category (this is a simplification, in a real test you'd need to find and press the category item)
    const foodCategory = getByText('Food');
    fireEvent.press(foodCategory);

    // Submit the form
    fireEvent.press(getByText('保存'));

    // Check if the action was dispatched
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions[0].type).toBe('transactions/addTransaction/pending');
    });
  });

  it('navigates back when cancel button is pressed', () => {
    const { getByText } = render(
      <Provider store={store}>
        <TransactionFormScreen navigation={mockNavigation} route={mockRoute} />
      </Provider>
    );

    // Press the back button (this is a simplification, in a real test you'd need to find the actual back button)
    const backButton = getByText('新規取引').parent.children[0];
    fireEvent.press(backButton);

    // Check if navigation.goBack was called
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
