import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// Import Redux slices for testing
import authSlice, { loginUser, registerUser, logoutUser } from '../src/store/slices/authSlice';
import transactionsSlice, { 
  addTransaction, 
  updateTransaction, 
  deleteTransaction 
} from '../src/store/slices/transactionsSlice';
import categoriesSlice, {
  addCategory,
  updateCategory,
  deleteCategory
} from '../src/store/slices/categoriesSlice';
import themeSlice, { toggleTheme } from '../src/store/slices/themeSlice';

// Create mock store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Redux Slices', () => {
  describe('authSlice', () => {
    it('should handle initial state', () => {
      expect(authSlice.reducer(undefined, { type: 'unknown' })).toEqual({
        user: null,
        status: 'idle',
        error: null,
        isAuthenticated: false,
      });
    });

    it('should handle setUser', () => {
      const user = { uid: '123', email: 'test@example.com', displayName: 'Test User' };
      expect(
        authSlice.reducer(undefined, { type: 'auth/setUser', payload: user })
      ).toEqual({
        user,
        status: 'idle',
        error: null,
        isAuthenticated: true,
      });
    });

    it('should handle loginUser.pending', () => {
      expect(
        authSlice.reducer(undefined, { type: 'auth/loginUser/pending' })
      ).toEqual({
        user: null,
        status: 'loading',
        error: null,
        isAuthenticated: false,
      });
    });

    it('should handle loginUser.fulfilled', () => {
      const user = { uid: '123', email: 'test@example.com', displayName: 'Test User' };
      expect(
        authSlice.reducer(undefined, { type: 'auth/loginUser/fulfilled', payload: user })
      ).toEqual({
        user,
        status: 'succeeded',
        error: null,
        isAuthenticated: true,
      });
    });

    it('should handle loginUser.rejected', () => {
      expect(
        authSlice.reducer(undefined, { 
          type: 'auth/loginUser/rejected', 
          error: { message: 'Invalid credentials' } 
        })
      ).toEqual({
        user: null,
        status: 'failed',
        error: 'Invalid credentials',
        isAuthenticated: false,
      });
    });
  });

  describe('transactionsSlice', () => {
    it('should handle initial state', () => {
      expect(transactionsSlice.reducer(undefined, { type: 'unknown' })).toEqual({
        transactions: [],
        status: 'idle',
        error: null,
      });
    });

    it('should handle fetchTransactions.pending', () => {
      expect(
        transactionsSlice.reducer(undefined, { type: 'transactions/fetchTransactions/pending' })
      ).toEqual({
        transactions: [],
        status: 'loading',
        error: null,
      });
    });

    it('should handle fetchTransactions.fulfilled', () => {
      const transactions = [
        { id: '1', amount: 1000, type: 'expense' },
        { id: '2', amount: 5000, type: 'income' },
      ];
      expect(
        transactionsSlice.reducer(undefined, { 
          type: 'transactions/fetchTransactions/fulfilled', 
          payload: transactions 
        })
      ).toEqual({
        transactions,
        status: 'succeeded',
        error: null,
      });
    });

    it('should handle addTransaction.fulfilled', () => {
      const initialState = {
        transactions: [{ id: '1', amount: 1000, type: 'expense' }],
        status: 'succeeded',
        error: null,
      };
      const newTransaction = { id: '2', amount: 5000, type: 'income' };
      expect(
        transactionsSlice.reducer(initialState, { 
          type: 'transactions/addTransaction/fulfilled', 
          payload: newTransaction 
        })
      ).toEqual({
        transactions: [...initialState.transactions, newTransaction],
        status: 'succeeded',
        error: null,
      });
    });

    it('should handle updateTransaction.fulfilled', () => {
      const initialState = {
        transactions: [
          { id: '1', amount: 1000, type: 'expense' },
          { id: '2', amount: 5000, type: 'income' },
        ],
        status: 'succeeded',
        error: null,
      };
      const updatedTransaction = { id: '1', amount: 1500, type: 'expense' };
      expect(
        transactionsSlice.reducer(initialState, { 
          type: 'transactions/updateTransaction/fulfilled', 
          payload: updatedTransaction 
        })
      ).toEqual({
        transactions: [updatedTransaction, initialState.transactions[1]],
        status: 'succeeded',
        error: null,
      });
    });

    it('should handle deleteTransaction.fulfilled', () => {
      const initialState = {
        transactions: [
          { id: '1', amount: 1000, type: 'expense' },
          { id: '2', amount: 5000, type: 'income' },
        ],
        status: 'succeeded',
        error: null,
      };
      expect(
        transactionsSlice.reducer(initialState, { 
          type: 'transactions/deleteTransaction/fulfilled', 
          payload: '1' 
        })
      ).toEqual({
        transactions: [initialState.transactions[1]],
        status: 'succeeded',
        error: null,
      });
    });
  });

  describe('categoriesSlice', () => {
    it('should handle initial state', () => {
      expect(categoriesSlice.reducer(undefined, { type: 'unknown' })).toEqual({
        categories: [],
        status: 'idle',
        error: null,
      });
    });

    it('should handle fetchCategories.fulfilled', () => {
      const categories = [
        { id: '1', name: 'Food', type: 'expense' },
        { id: '2', name: 'Salary', type: 'income' },
      ];
      expect(
        categoriesSlice.reducer(undefined, { 
          type: 'categories/fetchCategories/fulfilled', 
          payload: categories 
        })
      ).toEqual({
        categories,
        status: 'succeeded',
        error: null,
      });
    });

    it('should handle addCategory.fulfilled', () => {
      const initialState = {
        categories: [{ id: '1', name: 'Food', type: 'expense' }],
        status: 'succeeded',
        error: null,
      };
      const newCategory = { id: '2', name: 'Salary', type: 'income' };
      expect(
        categoriesSlice.reducer(initialState, { 
          type: 'categories/addCategory/fulfilled', 
          payload: newCategory 
        })
      ).toEqual({
        categories: [...initialState.categories, newCategory],
        status: 'succeeded',
        error: null,
      });
    });
  });

  describe('themeSlice', () => {
    it('should handle initial state', () => {
      expect(themeSlice.reducer(undefined, { type: 'unknown' })).toEqual({
        darkMode: false,
      });
    });

    it('should handle toggleTheme', () => {
      expect(
        themeSlice.reducer({ darkMode: false }, { type: 'theme/toggleTheme' })
      ).toEqual({
        darkMode: true,
      });

      expect(
        themeSlice.reducer({ darkMode: true }, { type: 'theme/toggleTheme' })
      ).toEqual({
        darkMode: false,
      });
    });

    it('should handle setTheme', () => {
      expect(
        themeSlice.reducer(undefined, { type: 'theme/setTheme', payload: true })
      ).toEqual({
        darkMode: true,
      });
    });
  });
});
