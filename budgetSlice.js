import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { database } from '../../services/firebaseConfig';
import { ref, push, set, get, remove, update } from 'firebase/database';
import { auth } from '../../services/firebaseConfig';

// Async thunks
export const fetchBudgets = createAsyncThunk(
  'budget/fetchBudgets',
  async (_, { rejectWithValue }) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');
      
      const budgetsRef = ref(database, `users/${userId}/budgets`);
      const snapshot = await get(budgetsRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
      }
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addBudget = createAsyncThunk(
  'budget/addBudget',
  async (budget, { rejectWithValue }) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');
      
      const budgetsRef = ref(database, `users/${userId}/budgets`);
      const newBudgetRef = push(budgetsRef);
      
      const newBudget = {
        ...budget,
        createdAt: new Date().toISOString(),
      };
      
      await set(newBudgetRef, newBudget);
      return { id: newBudgetRef.key, ...newBudget };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBudget = createAsyncThunk(
  'budget/updateBudget',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');
      
      const budgetRef = ref(database, `users/${userId}/budgets/${id}`);
      await update(budgetRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      
      return { id, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBudget = createAsyncThunk(
  'budget/deleteBudget',
  async (id, { rejectWithValue }) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');
      
      const budgetRef = ref(database, `users/${userId}/budgets/${id}`);
      await remove(budgetRef);
      
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  budgets: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    clearBudgets: (state) => {
      state.budgets = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch budgets
      .addCase(fetchBudgets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.budgets = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Add budget
      .addCase(addBudget.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addBudget.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.budgets.push(action.payload);
      })
      .addCase(addBudget.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Update budget
      .addCase(updateBudget.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.budgets.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Delete budget
      .addCase(deleteBudget.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.budgets = state.budgets.filter(b => b.id !== action.payload);
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearBudgets } = budgetSlice.actions;
export default budgetSlice.reducer;
