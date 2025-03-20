import { auth, database, storage } from './firebaseConfig';
import { 
  ref as databaseRef, 
  set, 
  get, 
  push, 
  update, 
  remove, 
  query, 
  orderByChild 
} from 'firebase/database';
import { 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';

// Authentication services
export const authService = {
  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },
  
  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const userRef = databaseRef(database, `users/${userId}/profile`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return null;
    } catch (error) {
      throw error;
    }
  },
  
  // Update user profile
  updateUserProfile: async (userId, profileData) => {
    try {
      const userRef = databaseRef(database, `users/${userId}/profile`);
      await update(userRef, {
        ...profileData,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      throw error;
    }
  },
};

// Transaction services
export const transactionService = {
  // Get all transactions
  getTransactions: async (userId) => {
    try {
      const transactionsRef = databaseRef(database, `users/${userId}/transactions`);
      const snapshot = await get(transactionsRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
      }
      return [];
    } catch (error) {
      throw error;
    }
  },
  
  // Get transaction by ID
  getTransactionById: async (userId, transactionId) => {
    try {
      const transactionRef = databaseRef(database, `users/${userId}/transactions/${transactionId}`);
      const snapshot = await get(transactionRef);
      
      if (snapshot.exists()) {
        return {
          id: transactionId,
          ...snapshot.val()
        };
      }
      return null;
    } catch (error) {
      throw error;
    }
  },
  
  // Add new transaction
  addTransaction: async (userId, transaction) => {
    try {
      const transactionsRef = databaseRef(database, `users/${userId}/transactions`);
      const newTransactionRef = push(transactionsRef);
      
      const newTransaction = {
        ...transaction,
        createdAt: new Date().toISOString(),
      };
      
      await set(newTransactionRef, newTransaction);
      return { id: newTransactionRef.key, ...newTransaction };
    } catch (error) {
      throw error;
    }
  },
  
  // Update transaction
  updateTransaction: async (userId, transactionId, data) => {
    try {
      const transactionRef = databaseRef(database, `users/${userId}/transactions/${transactionId}`);
      await update(transactionRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      
      return { id: transactionId, ...data };
    } catch (error) {
      throw error;
    }
  },
  
  // Delete transaction
  deleteTransaction: async (userId, transactionId) => {
    try {
      const transactionRef = databaseRef(database, `users/${userId}/transactions/${transactionId}`);
      await remove(transactionRef);
      
      return transactionId;
    } catch (error) {
      throw error;
    }
  },
  
  // Upload receipt image
  uploadReceiptImage: async (userId, transactionId, imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      const imageRef = storageRef(storage, `users/${userId}/receipts/${transactionId}`);
      await uploadBytes(imageRef, blob);
      
      const downloadURL = await getDownloadURL(imageRef);
      
      // Update transaction with receipt URL
      const transactionRef = databaseRef(database, `users/${userId}/transactions/${transactionId}`);
      await update(transactionRef, {
        receiptUrl: downloadURL,
        updatedAt: new Date().toISOString(),
      });
      
      return downloadURL;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete receipt image
  deleteReceiptImage: async (userId, transactionId) => {
    try {
      const imageRef = storageRef(storage, `users/${userId}/receipts/${transactionId}`);
      await deleteObject(imageRef);
      
      // Update transaction to remove receipt URL
      const transactionRef = databaseRef(database, `users/${userId}/transactions/${transactionId}`);
      await update(transactionRef, {
        receiptUrl: null,
        updatedAt: new Date().toISOString(),
      });
      
      return true;
    } catch (error) {
      throw error;
    }
  },
};

// Category services
export const categoryService = {
  // Get all categories
  getCategories: async (userId) => {
    try {
      const categoriesRef = databaseRef(database, `users/${userId}/categories`);
      const snapshot = await get(categoriesRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
      }
      return [];
    } catch (error) {
      throw error;
    }
  },
  
  // Add new category
  addCategory: async (userId, category) => {
    try {
      const categoriesRef = databaseRef(database, `users/${userId}/categories`);
      const newCategoryRef = push(categoriesRef);
      
      const newCategory = {
        ...category,
        createdAt: new Date().toISOString(),
      };
      
      await set(newCategoryRef, newCategory);
      return { id: newCategoryRef.key, ...newCategory };
    } catch (error) {
      throw error;
    }
  },
  
  // Update category
  updateCategory: async (userId, categoryId, data) => {
    try {
      const categoryRef = databaseRef(database, `users/${userId}/categories/${categoryId}`);
      await update(categoryRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      
      return { id: categoryId, ...data };
    } catch (error) {
      throw error;
    }
  },
  
  // Delete category
  deleteCategory: async (userId, categoryId) => {
    try {
      const categoryRef = databaseRef(database, `users/${userId}/categories/${categoryId}`);
      await remove(categoryRef);
      
      return categoryId;
    } catch (error) {
      throw error;
    }
  },
};

// Budget services
export const budgetService = {
  // Get all budgets
  getBudgets: async (userId) => {
    try {
      const budgetsRef = databaseRef(database, `users/${userId}/budgets`);
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
      throw error;
    }
  },
  
  // Add new budget
  addBudget: async (userId, budget) => {
    try {
      const budgetsRef = databaseRef(database, `users/${userId}/budgets`);
      const newBudgetRef = push(budgetsRef);
      
      const newBudget = {
        ...budget,
        createdAt: new Date().toISOString(),
      };
      
      await set(newBudgetRef, newBudget);
      return { id: newBudgetRef.key, ...newBudget };
    } catch (error) {
      throw error;
    }
  },
  
  // Update budget
  updateBudget: async (userId, budgetId, data) => {
    try {
      const budgetRef = databaseRef(database, `users/${userId}/budgets/${budgetId}`);
      await update(budgetRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      
      return { id: budgetId, ...data };
    } catch (error) {
      throw error;
    }
  },
  
  // Delete budget
  deleteBudget: async (userId, budgetId) => {
    try {
      const budgetRef = databaseRef(database, `users/${userId}/budgets/${budgetId}`);
      await remove(budgetRef);
      
      return budgetId;
    } catch (error) {
      throw error;
    }
  },
};

// Data export and backup services
export const dataService = {
  // Export data to CSV
  exportToCSV: async (userId, dataType) => {
    try {
      let dataRef;
      
      switch (dataType) {
        case 'transactions':
          dataRef = databaseRef(database, `users/${userId}/transactions`);
          break;
        case 'categories':
          dataRef = databaseRef(database, `users/${userId}/categories`);
          break;
        case 'budgets':
          dataRef = databaseRef(database, `users/${userId}/budgets`);
          break;
        default:
          throw new Error('Invalid data type');
      }
      
      const snapshot = await get(dataRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const items = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        // Convert to CSV format
        if (items.length === 0) return '';
        
        const headers = Object.keys(items[0]).filter(key => key !== 'id');
        const csvHeader = ['id', ...headers].join(',');
        
        const csvRows = items.map(item => {
          const values = ['id', ...headers].map(header => {
            const value = header === 'id' ? item.id : item[header];
            
            // Handle different value types
            if (value === null || value === undefined) return '';
            if (typeof value === 'object') return JSON.stringify(value);
            return String(value).replace(/,/g, ';'); // Replace commas to avoid CSV issues
          });
          
          return values.join(',');
        });
        
        return [csvHeader, ...csvRows].join('\n');
      }
      
      return '';
    } catch (error) {
      throw error;
    }
  },
  
  // Backup all user data
  backupUserData: async (userId) => {
    try {
      const userRef = databaseRef(database, `users/${userId}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        return snapshot.val();
      }
      
      return null;
    } catch (error) {
      throw error;
    }
  },
  
  // Restore user data from backup
  restoreUserData: async (userId, backupData) => {
    try {
      const userRef = databaseRef(database, `users/${userId}`);
      await set(userRef, {
        ...backupData,
        restoredAt: new Date().toISOString(),
      });
      
      return true;
    } catch (error) {
      throw error;
    }
  },
};
