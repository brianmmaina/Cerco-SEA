import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config.js';

// Test credentials
const TEST_EMAIL = 'test@cerco.com';
const TEST_PASSWORD = 'testpassword123';

// Test login function
export const testLogin = async () => {
  try {
    console.log('Testing login with:', TEST_EMAIL);

    // Try to sign in
    const userCredential = await signInWithEmailAndPassword(auth, TEST_EMAIL, TEST_PASSWORD);
    console.log('Login successful:', userCredential.user.email);

    // Check if user document exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    if (!userDoc.exists()) {
      console.log('Creating user document in Firestore...');
      const newUserData = {
        email: userCredential.user.email,
        name: userCredential.user.email.split('@')[0],
        university: 'University',
        avatar: null,
        isProfileComplete: false,
        eventsHosted: 0,
        eventsAttended: 0,
        memberSince: new Date().getFullYear().toString(),
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), newUserData);
      console.log('User document created in Firestore');
    }

    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Login failed:', error.code, error.message);

    // If user doesn't exist, try to create one
    if (error.code === 'auth/user-not-found') {
      console.log('User not found, creating test user...');
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          TEST_EMAIL,
          TEST_PASSWORD,
        );
        console.log('Test user created and logged in:', userCredential.user.email);

        // Create user document in Firestore
        const newUserData = {
          email: userCredential.user.email,
          name: userCredential.user.email.split('@')[0],
          university: 'University',
          avatar: null,
          isProfileComplete: false,
          eventsHosted: 0,
          eventsAttended: 0,
          memberSince: new Date().getFullYear().toString(),
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, 'users', userCredential.user.uid), newUserData);
        console.log('User document created in Firestore');

        return { success: true, user: userCredential.user, isNewUser: true };
      } catch (createError) {
        console.error('Failed to create test user:', createError.code, createError.message);
        return { success: false, error: createError.message };
      }
    }

    return { success: false, error: error.message };
  }
};

// Test with different credentials
export const testLoginWithCredentials = async (email, password) => {
  try {
    console.log('Testing login with:', email);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Login successful:', userCredential.user.email);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Login failed:', error.code, error.message);
    return { success: false, error: error.message };
  }
};
