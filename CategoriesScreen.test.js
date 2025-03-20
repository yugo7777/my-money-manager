import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import CategoriesScreen from '../src/screens/CategoriesScreen';

// Mock the navigation
const mockNavigation = {
  navigate: jest.fn(),
};

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Create mock store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('CategoriesScreen', () => {
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
  });

  it('renders correctly with categories', () => {
    const { getByText } = render(
      <Provider store={store}>
        <CategoriesScreen navigation={mockNavigation} />
      </Provider>
    );

    // Check if important elements are rendered
    expect(getByText('カテゴリ管理')).toBeTruthy();
    expect(getByText('新規カテゴリを追加')).toBeTruthy();
    expect(getByText('支出カテゴリ')).toBeTruthy();
    expect(getByText('収入カテゴリ')).toBeTruthy();
    expect(getByText('Food')).toBeTruthy();
    expect(getByText('Transportation')).toBeTruthy();
    expect(getByText('Salary')).toBeTruthy();
  });

  it('shows category form when add button is pressed', () => {
    const { getByText, queryByText } = render(
      <Provider store={store}>
        <CategoriesScreen navigation={mockNavigation} />
      </Provider>
    );

    // Initially form is not shown
    expect(queryByText('新規カテゴリ')).toBeNull();

    // Press add button
    fireEvent.press(getByText('新規カテゴリを追加'));

    // Form should be shown
    expect(getByText('新規カテゴリ')).toBeTruthy();
    expect(getByText('カテゴリ名')).toBeTruthy();
    expect(getByText('タイプ:')).toBeTruthy();
    expect(getByText('アイコン:')).toBeTruthy();
    expect(getByText('カラー:')).toBeTruthy();
    expect(getByText('保存')).toBeTruthy();
  });

  it('shows edit form when edit button is pressed', () => {
    const { getAllByText, getByText } = render(
      <Provider store={store}>
        <CategoriesScreen navigation={mockNavigation} />
      </Provider>
    );

    // Find and press edit button for Food category
    const editButtons = getAllByText('').filter(node => 
      node.props.children && 
      node.props.children.type === 'MaterialIcons' && 
      node.props.children.props.name === 'edit'
    );
    fireEvent.press(editButtons[0]);

    // Edit form should be shown
    expect(getByText('カテゴリを編集')).toBeTruthy();
  });

  it('shows validation errors when form is submitted with empty fields', () => {
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <CategoriesScreen navigation={mockNavigation} />
      </Provider>
    );

    // Open form
    fireEvent.press(getByText('新規カテゴリを追加'));

    // Clear category name
    fireEvent.changeText(getByPlaceholderText('カテゴリ名を入力'), '');

    // Submit form
    fireEvent.press(getByText('保存'));

    // Validation error should be shown
    expect(getByText('カテゴリ名を入力してください')).toBeTruthy();
  });

  it('dispatches addCategory action when form is valid', async () => {
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <CategoriesScreen navigation={mockNavigation} />
      </Provider>
    );

    // Open form
    fireEvent.press(getByText('新規カテゴリを追加'));

    // Fill form
    fireEvent.changeText(getByPlaceholderText('カテゴリ名を入力'), 'New Category');

    // Submit form
    fireEvent.press(getByText('保存'));

    // Check if action was dispatched
    await waitFor(() => {
      const actions = store.getActions();
      expect(actions[1].type).toBe('categories/addCategory/pending');
    });
  });

  it('dispatches fetchCategories on mount', () => {
    render(
      <Provider store={store}>
        <CategoriesScreen navigation={mockNavigation} />
      </Provider>
    );

    // Check if action was dispatched
    const actions = store.getActions();
    expect(actions[0].type).toBe('categories/fetchCategories/pending');
  });
});
