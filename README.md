[![License](https://img.shields.io/github/license/brianmmaina/Cerco-SEA)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/brianmmaina/Cerco-SEA)](https://github.com/brianmmaina/Cerco-SEA/commits/main)
[![Stars](https://img.shields.io/github/stars/brianmmaina/Cerco-SEA?style=social)](https://github.com/brianmmaina/Cerco-SEA/stargazers)
[![Issues](https://img.shields.io/github/issues/brianmmaina/Cerco-SEA)](https://github.com/brianmmaina/Cerco-SEA/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/brianmmaina/Cerco-SEA)](https://github.com/brianmmaina/Cerco-SEA/pulls)
[![Top Language](https://img.shields.io/github/languages/top/brianmmaina/Cerco-SEA)](https://github.com/brianmmaina/Cerco-SEA)
[![Repo Size](https://img.shields.io/github/repo-size/brianmmaina/Cerco-SEA)](https://github.com/brianmmaina/Cerco-SEA)
[![Code Size](https://img.shields.io/github/languages/code-size/brianmmaina/Cerco-SEA)](https://github.com/brianmmaina/Cerco-SEA)

[![React Native](https://img.shields.io/badge/Frontend-React%20Native-61DAFB?logo=react)](https://reactnative.dev/)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?logo=firebase)](https://firebase.google.com/)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript-F7DF1E?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Expo](https://img.shields.io/badge/Framework-Expo-000020?logo=expo)](https://expo.dev/)

# Cerco - Student Events Platform

A React Native mobile app for students to discover, create, and engage with campus events. Built with Expo, Firebase, and modern React Native practices.

## Features

### Core Features (Completed)

- **Student-Only Authentication**: Email domain validation for student access
- **Email Verification**: Secure signup with email verification flow
- **Event Creation**: Full event creation with images, location, and details
- **Real-time Feed**: Live event updates with interactive features
- **Interactive Actions**: Like, RSVP, and save events
- **Calendar View**: Browse events by date with visual indicators
- **Map Integration**: View events on an interactive map
- **Image Upload**: Event posters with Firebase Storage
- **User Profiles**: Stats, saved events, and account management
- **Settings**: Comprehensive app preferences and account options

### Key Features

- **Student Domain Validation**: Restricted to verified student emails
- **Real-time Updates**: Live synchronization across all users
- **Image Support**: Event posters and profile pictures
- **Location Services**: Map integration with coordinates
- **Scheduled Resets**: Automated daily/weekly data management
- **Modern UI**: Clean, intuitive interface with consistent theming

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Navigation**: React Navigation v7
- **Maps**: React Native Maps
- **Calendar**: React Native Calendars
- **Images**: Expo Image Picker
- **Cloud Functions**: Firebase Functions for scheduled tasks

## Screens

1. **Authentication**
   - Login (student email validation)
   - Signup (student domain verification)
   - Email Verification

2. **Main App**
   - Feed (event discovery)
   - Create Event (with image upload)
   - Calendar (date-based browsing)
   - Map (location-based view)
   - Profile (user stats & settings)

3. **Event Details**
   - Full event information
   - Interactive actions (like, RSVP, save)
   - Event images and location

## Setup

### Prerequisites

- Node.js (v18+)
- Expo CLI
- Firebase project

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cerco

# Install dependencies
npm install

# Start the development server
npm start
```

### Firebase Setup

1. Create a Firebase project
2. Enable Authentication, Firestore, and Storage
3. Update `src/firebase/config.js` with your Firebase config
4. Deploy cloud functions: `firebase deploy --only functions`

### Environment Variables & API Keys Setup

**IMPORTANT: API Keys are excluded from version control for security reasons**

The `src/config/apiKeys.js` file containing your actual API keys is excluded from Git via `.gitignore`. This prevents accidentally exposing sensitive credentials.

#### Setup Instructions:

1. **Copy all template files:**

   ```bash
   cp src/config/apiKeys.template.js src/config/apiKeys.js
   cp app.template.json app.json
   cp .firebaserc.template .firebaserc
   cp public/index.template.html public/index.html
   ```

2. **Add your API keys to `src/config/apiKeys.js`:**

   ```javascript
   export const FIREBASE_CONFIG = {
     apiKey: 'your_actual_firebase_api_key',
     authDomain: 'your_project.firebaseapp.com',
     projectId: 'your_project_id',
     storageBucket: 'your_project.firebasestorage.app',
     messagingSenderId: 'your_sender_id',
     appId: 'your_app_id',
     measurementId: 'your_measurement_id',
   };

   export const GOOGLE_MAPS_API_KEY = 'your_actual_google_maps_api_key';
   ```

3. **Update `app.json` with your Google Maps API key:**

   ```json
   {
     "ios": {
       "config": {
         "googleMapsApiKey": "your_google_maps_api_key"
       }
     },
     "android": {
       "config": {
         "googleMaps": {
           "apiKey": "your_google_maps_api_key"
         }
       }
     }
   }
   ```

4. **Update `.firebaserc` with your Firebase project ID:**

   ```json
   {
     "projects": {
       "default": "your_firebase_project_id"
     }
   }
   ```

5. **Update `public/index.html` with your Firebase config for password reset:**

   ```javascript
   const firebaseConfig = {
     apiKey: 'your_firebase_api_key',
     authDomain: 'your_project_id.firebaseapp.com',
     projectId: 'your_project_id',
     storageBucket: 'your_project_id.firebasestorage.app',
     messagingSenderId: 'your_messaging_sender_id',
     appId: 'your_app_id',
   };
   ```

6. **Get your API keys:**
   - **Firebase**: Go to [Firebase Console](https://console.firebase.google.com/) → Project Settings → General → Your Apps
   - **Google Maps**: Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials

#### Why This Approach?

- **Security**: Prevents accidental exposure of API keys
- **Best Practice**: Industry standard for handling sensitive data
- **Team Development**: Each developer can use their own keys
- **Production Ready**: Easy to switch between development/production keys

#### Alternative: Environment Variables

For production, consider using environment variables:

```bash
# .env file (also in .gitignore)
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
```

## Security Features

- **Student Email Validation**: Only verified student domains allowed
- **Email Verification**: Required for account activation
- **Firebase Security Rules**: Proper data access controls
- **Input Validation**: Form validation and sanitization
- **API Key Protection**: Sensitive credentials excluded from version control
- **Password Reset**: Secure web-based password reset flow
- **Authentication State Management**: Secure user session handling

## Data Management

### Cloud Functions

- **Daily Reset**: Resets daily engagement metrics
- **Weekly Reset**: Resets weekly engagement metrics
- **Cleanup**: Removes events older than 30 days

### Real-time Features

- Live event updates
- Real-time engagement tracking
- Instant user interaction feedback

## Deployment

### Expo Build

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

### Firebase Functions

```bash
# Deploy cloud functions
firebase deploy --only functions
```

## Performance

- **Optimized Images**: Compressed and cached
- **Lazy Loading**: Efficient data fetching
- **Real-time Updates**: Minimal network overhead
- **Offline Support**: Basic offline functionality


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email: bmmaina@bu.edu

---

**Cerco** - Connecting students through events
