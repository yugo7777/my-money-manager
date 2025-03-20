import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import HomeScreen from '../src/screens/HomeScreen';

// Mock the navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Create mock store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('HomeScreen', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: { uid: 'test-user-id', email: 'test@example.com', displayName: 'Test User' },
      },
      transactions: {
        transactions: [
          {
            id: '1',
            type: 'expense',
            amount: 1000,
            date: '2025-03-20T00:00:00.000Z',
            categoryId: '1',
            category: { id: '1', name: 'Food', icon: 'restaurant', color: '#FF5722', type: 'expense' },
            memo: 'Lunch',
          },
          {
            id: '2',
            type: 'income',
            amount: 5000,
            date: '2025-03-19T00:00:00.000Z',
            categoryId: '3',
            category: { id: '3', name: 'Salary', icon: 'attach-money', color: '#2196F3', type: 'income' },
            memo: 'Part-time job',
          },
        ],
        status: 'succeeded',
      },
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
  });

  it('renders correctly with transactions', () => {
    const { getByText, getAllByText } = render(
      <Provider store={store}>
        <HomeScreen navigation={mockNavigation} />
      </Provider>
    );

    // Check if important elements are rendered
    expect(getByText('My Money Manager')).toBeTruthy();
    expect(getByText('取引を追加')).toBeTruthy();
    expect(getByText('最近の取引')).toBeTruthy();
    expect(getByText('すべて表示')).toBeTruthy();
    expect(getByText('Food')).toBeTruthy();
    expect(getByText('Salary')).toBeTruthy();
    expect(getByText('Lunch')).toBeTruthy();
    expect(getByText('Part-time job')).toBeTruthy();
    expect(getByText('支出内訳')).toBeTruthy();
  });

  it('navigates to TransactionForm when add button is pressed', () => {
    const { getByText } = render(
      <Provider store={store}>
        <HomeScreen navigation={mockNavigation} />
      </Provider>
    );

    // Press the add transaction button
    fireEvent.press(getByText('取引を追加'));

    // Check if navigation was called with correct params
    expect(mockNavigation.navigate).toHaveBeenCalledWith('TransactionForm');
  });

  it('navigates to Reports when view all is pressed', () => {
    const { getByText } = render(
      <Provider store={store}>
        <HomeScreen navigation={mockNavigation} />
      </Provider>
    );

    // Press the view all button
    fireEvent.press(getByText('すべて表示'));

    // Check if navigation was called with correct params
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Reports');
  });

  it('navigates to TransactionForm with transaction when transaction item is pressed', () => {
    const { getByText } = render(
      <Provider store={store}>
        <HomeScreen navigation={mockNavigation} />
      </Provider>
    );

    // Press a transaction item (this is a simplification, in a real test you'd need to find the actual item)
    fireEvent.press(getByText('Lunch'));

    // Check if navigation was called with correct params
    expect(mockNavigation.navigate).toHaveBeenCalledWith('TransactionForm', {
      transaction: expect.objectContaining({
        id: '1',
        type: 'expense',
        amount: 1000,
        categoryId: '1',
        memo: 'Lunch',
      }),
    });
  });

  it('dispatches fetchTransactions and fetchCategories on mount', () => {
    render(
      <Provider store={store}>
        <HomeScreen navigation={mockNavigation} />
      </Provider>
    );

    // Check if the actions were dispatched
    const actions = store.getActions();
    expect(actions[0].type).toBe('transactions/fetchTransactions/pending');
    expect(actions[1].type).toBe('categories/fetchCategories/pending');
  });

  it('renders empty state when no transactions', () => {
    const emptyStore = mockStore({
      auth: {
        user: { uid: 'test-user-id', email: 'test@example.com', displayName: 'Test User' },
      },
      transactions: {
        transactions: [],
        status: 'succeeded',
      },
      categories: {
        categories: [],
        status: 'succeeded',
      },
      theme: {
        darkMode: false,
      },
    });

    const { getByText } = render(
      <Provider store={emptyStore}>
        <HomeScreen navigation={mockNavigation} />
      </Provider>
    );

    // Check if empty state is rendered
    expect(getByText('取引がありません')).toBeTruthy();
  });
});
