// API Keys Configuration Template
// 
// IMPORTANT: This is a template file. DO NOT commit your actual API keys to version control.
// 
// To use this template:
// 1. Copy this file to `src/config/apiKeys.js`
// 2. Replace the placeholder values with your actual API keys
// 3. The `apiKeys.js` file is already in .gitignore and will not be committed

export const FIREBASE_CONFIG = {
  apiKey: "your_firebase_api_key_here",
  authDomain: "your_project_id.firebaseapp.com",
  projectId: "your_project_id",
  storageBucket: "your_project_id.firebasestorage.app",
  messagingSenderId: "your_messaging_sender_id",
  appId: "your_app_id",
  measurementId: "your_measurement_id"
};

export const GOOGLE_MAPS_API_KEY = "your_google_maps_api_key_here";

// Instructions for getting API keys:
//
// FIREBASE SETUP:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select existing one
// 3. Go to Project Settings > General
// 4. Scroll down to "Your apps" section
// 5. Click on your app (or create one if none exists)
// 6. Copy the config values from the provided code snippet
//
// GOOGLE MAPS SETUP:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select existing one
// 3. Enable Maps SDK for Android and iOS
// 4. Go to Credentials > Create Credentials > API Key
// 5. Copy the generated API key
//
// SECURITY NOTES:
// - Never commit API keys to version control
// - Use environment variables in production
// - Restrict API keys to specific domains/apps in Google Cloud Console
// - Regularly rotate your API keys
