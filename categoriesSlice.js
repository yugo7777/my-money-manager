import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { database } from '../../services/firebaseConfig';
import { ref, push, set, get, remove, update } from 'firebase/database';
import { auth } from '../../services/firebaseConfig';

// Default categories
const defaultCategories = [
  { name: 'Food', icon: 'food', color: '#FF5722', type: 'expense' },
  { name: 'Transportation', icon: 'car', color: '#4CAF50', type: 'expense' },
  { name: 'Housing', icon: 'home', color: '#9C27B0', type: 'expense' },
  { name: 'Entertainment', icon: 'movie', color: '#FFEB3B', type: 'expense' },
  { name: 'Medical', icon: 'medical-bag', color: '#F44336', type: 'expense' },
  { name: 'Salary', icon: 'cash', color: '#2196F3', type: 'income' },
];

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');
      
      const categoriesRef = ref(database, `users/${userId}/categories`);
      const snapshot = await get(categoriesRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
      }
      
      // If no categories exist, initialize with defaults
      const promises = defaultCategories.map(category => {
        const newCategoryRef = push(categoriesRef);
        return set(newCategoryRef, category).then(() => ({
          id: newCategoryRef.key,
          ...category
        }));
      });
      
      return await Promise.all(promises);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (category, { rejectWithValue }) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');
      
      const categoriesRef = ref(database, `users/${userId}/categories`);
      const newCategoryRef = push(categoriesRef);
      
      const newCategory = {
        ...category,
        createdAt: new Date().toISOString(),
      };
      
      await set(newCategoryRef, newCategory);
      return { id: newCategoryRef.key, ...newCategory };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');
      
      const categoryRef = ref(database, `users/${userId}/categories/${id}`);
      await update(categoryRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      
      return { id, ...data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('User not authenticated');
      
      const categoryRef = ref(database, `users/${userId}/categories/${id}`);
      await remove(categoryRef);
      
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  categories: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategories: (state) => {
      state.categories = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Add category
      .addCase(addCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.categories.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = state.categories.filter(c => c.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
