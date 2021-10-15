import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import "firebase/database";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const authService = getAuth();

// Line 15:33: 'firebase' is not defined no-undef 오류 발생했음.
// export const firebaseInstance = firebase; 라고 적어서 그럼 안 작어도 된다?
