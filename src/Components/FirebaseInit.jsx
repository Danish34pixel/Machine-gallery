// src/Components/FirebaseInit.jsx
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD1mgs3YMAmcZTLOmCeQt4aONXuWS8zxTo",
  authDomain: "gymwebsite-a3501.firebaseapp.com",
  projectId: "gymwebsite-a3501",
  storageBucket: "gymwebsite-a3501.firebasestorage.app",
  messagingSenderId: "594044257362",
  appId: "1:594044257362:web:92a18a27a9a5ebd8f14b8b",
  measurementId: "G-XNYS65T5SL",
};

// Initialize Firebase only once
let app, analytics;
if (!window._firebaseInitialized) {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  window._firebaseInitialized = true;
}

export { app, analytics };
