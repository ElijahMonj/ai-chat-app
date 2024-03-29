import { initializeApp,getApps } from "firebase/app";
import {getAuth} from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {getFirestore} from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig =  {
    apiKey: "AIzaSyAP0zn0b9_OctzQjQgTX5iFCb8zY_IiPOA",
    authDomain: "test-auth-417304.firebaseapp.com",
    projectId: "test-auth-417304",
    storageBucket: "test-auth-417304.appspot.com",
    messagingSenderId: "331804310227",
    appId: "1:331804310227:web:5aaee963394909a8327226"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);

export const FIREBASE_AUTH = Platform.OS === 'web' ? getAuth(FIREBASE_APP) : initializeAuth(FIREBASE_APP, {persistence: getReactNativePersistence(ReactNativeAsyncStorage)});

export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH_WEB = getAuth(FIREBASE_APP);