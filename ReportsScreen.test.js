import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ReportsScreen from '../src/screens/ReportsScreen';

// Mock the navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Create mock store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('ReportsScreen', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
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

  it('renders correctly with data', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ReportsScreen navigation={mockNavigation} />
      </Provider>
    );

    // Check if important elements are rendered
    expect(getByText('レポート')).toBeTruthy();
    expect(getByText('月次')).toBeTruthy();
    expect(getByText('年次')).toBeTruthy();
    expect(getByText('フィルター:')).toBeTruthy();
    expect(getByText('すべて')).toBeTruthy();
    expect(getByText('収入')).toBeTruthy();
    expect(getByText('支出')).toBeTruthy();
    expect(getByText('カテゴリ:')).toBeTruthy();
    expect(getByText('すべてのカテゴリ')).toBeTruthy();
    expect(getByText('支出内訳')).toBeTruthy();
    expect(getByText('収支推移')).toBeTruthy();
    expect(getByText('CSVでエクスポート')).toBeTruthy();
  });

  it('toggles between monthly and yearly reports', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ReportsScreen navigation={mockNavigation} />
      </Provider>
    );

    // Initially in monthly mode
    expect(getByText('月次').parent.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: expect.any(String) })
    );

    // Toggle to yearly mode
    fireEvent.press(getByText('年次'));

    // Now in yearly mode
    expect(getByText('年次').parent.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: expect.any(String) })
    );
  });

  it('filters transactions by type', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ReportsScreen navigation={mockNavigation} />
      </Provider>
    );

    // Initially showing all transactions
    expect(getByText('すべて').parent.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: expect.any(String) })
    );

    // Filter by income
    fireEvent.press(getByText('収入'));

    // Now showing only income
    expect(getByText('収入').parent.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: expect.any(String) })
    );

    // Filter by expense
    fireEvent.press(getByText('支出'));

    // Now showing only expenses
    expect(getByText('支出').parent.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: expect.any(String) })
    );
  });

  it('navigates between date periods', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ReportsScreen navigation={mockNavigation} />
      </Provider>
    );

    // Get the current date text
    const dateText = getByText(/\d{4}年\d{1,2}月/);
    const initialDate = dateText.props.children;

    // Navigate to previous period
    const prevButton = dateText.parent.children[0];
    fireEvent.press(prevButton);

    // Date should have changed
    expect(dateText.props.children).not.toBe(initialDate);

    // Navigate to next period
    const nextButton = dateText.parent.children[2];
    fireEvent.press(nextButton);

    // Date should be back to initial
    expect(dateText.props.children).toBe(initialDate);
  });

  it('dispatches fetchTransactions and fetchCategories on mount', () => {
    render(
      <Provider store={store}>
        <ReportsScreen navigation={mockNavigation} />
      </Provider>
    );

    // Check if the actions were dispatched
    const actions = store.getActions();
    expect(actions[0].type).toBe('transactions/fetchTransactions/pending');
    expect(actions[1].type).toBe('categories/fetchCategories/pending');
  });
});
