import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {getFirestore} from "firebase/firestore";
import firebaseKeys from "./firebaseKeys";
import { Platform } from "react-native";
const firebaseConfig = firebaseKeys

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);

export const FIREBASE_AUTH = Platform.OS === 'web' ? getAuth(FIREBASE_APP) : initializeAuth(FIREBASE_APP, {persistence: getReactNativePersistence(ReactNativeAsyncStorage)});

export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH_WEB = getAuth(FIREBASE_APP);