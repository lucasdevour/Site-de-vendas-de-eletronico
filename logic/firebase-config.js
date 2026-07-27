// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhPVplbeCbaQFy-4Oi9KEmsZaAYHO7i9Y",
  authDomain: "hagon-store.firebaseapp.com",
  projectId: "hagon-store",
  storageBucket: "hagon-store.firebasestorage.app",
  messagingSenderId: "681640518412",
  appId: "1:681640518412:web:e55ba45b33d999e1f81f29",
  measurementId: "G-XH6TJX5XNS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = firebase.auth();

// Export for use in other files
window.firebaseAuth = auth;