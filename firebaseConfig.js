import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Firebase configuration
// For production, these values should be stored in environment variables
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "my-money-manager-app.firebaseapp.com",
  databaseURL: "https://my-money-manager-app.firebaseio.com",
  projectId: "my-money-manager-app",
  storageBucket: "my-money-manager-app.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { auth, database, storage };
export default app;
