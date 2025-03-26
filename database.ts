import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSf_BFcSiMWF95aNV80ifZp85mdiMR1Lc",
  authDomain: "clicker-eba08.firebaseapp.com",
  projectId: "clicker-eba08",
  storageBucket: "clicker-eba08.firebasestorage.app",
  messagingSenderId: "72118926176",
  appId: "1:72118926176:web:757d18275d6549a8f0fc05",
  measurementId: "G-YXFR6Y5ZRD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
