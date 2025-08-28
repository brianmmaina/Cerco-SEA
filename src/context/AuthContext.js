import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? firebaseUser.email : 'No user');
      
      if (firebaseUser) {
        // User is signed in
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('User data found:', userData);
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              ...userData
            });
            setIsProfileComplete(userData.isProfileComplete || false);
          } else {
            // New user, create profile
            console.log('New user, creating basic profile');
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              isProfileComplete: false,
            });
            setIsProfileComplete(false);
          }
          setIsAuthenticated(true);
          console.log('Authentication state set to true');
        } catch (error) {
          console.error('Error loading user data:', error);
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            isProfileComplete: false,
          });
          setIsAuthenticated(true);
        }
      } else {
        // User is signed out
        console.log('User signed out');
        setUser(null);
        setIsAuthenticated(false);
        setIsProfileComplete(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate password strength
  const validatePassword = (password) => {
    if (password.length < 6) {
      return { valid: false, error: 'Password must be at least 6 characters long' };
    }
    return { valid: true };
  };

  const login = async (email, password) => {
    try {
      // Validate inputs
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      if (!validateEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return { success: false, error: passwordValidation.error };
      }

      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Update local state immediately
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          ...userData
        });
        setIsAuthenticated(true);
        setIsProfileComplete(userData.isProfileComplete || false);
        
        return { 
          success: true, 
          isNewUser: false,
          isProfileComplete: userData.isProfileComplete || false
        };
      } else {
        // New user, create basic profile in Firestore
        const newUserData = {
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          university: firebaseUser.email.split('@')[1]?.split('.')[0] || 'University',
          avatar: null,
          isProfileComplete: false,
          eventsHosted: 0,
          eventsAttended: 0,
          memberSince: new Date().getFullYear().toString(),
          createdAt: new Date().toISOString(),
        };
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', firebaseUser.uid), newUserData);
        
        // Update local state immediately
        setUser({
          id: firebaseUser.uid,
          ...newUserData
        });
        setIsAuthenticated(true);
        setIsProfileComplete(false);
        
        return { 
          success: true, 
          isNewUser: true,
          isProfileComplete: false
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        return { success: false, error: 'Invalid email or password' };
      } else if (error.code === 'auth/invalid-email') {
        return { success: false, error: 'Please enter a valid email address' };
      } else {
        return { success: false, error: 'Login failed. Please try again.' };
      }
    }
  };

  const signup = async (email, password, name) => {
    try {
      // Validate inputs
      if (!email || !password || !name) {
        return { success: false, error: 'All fields are required' };
      }

      if (!validateEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return { success: false, error: passwordValidation.error };
      }

      if (name.trim().length < 2) {
        return { success: false, error: 'Name must be at least 2 characters long' };
      }

      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Send email verification
      await sendEmailVerification(firebaseUser);

      // Create user document in Firestore
      const userData = {
        email: email,
        name: name.trim(),
        university: email.split('@')[1]?.split('.')[0] || 'University',
        avatar: null,
        isProfileComplete: false,
        eventsHosted: 0,
        eventsAttended: 0,
        memberSince: new Date().getFullYear().toString(),
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        return { success: false, error: 'An account with this email already exists' };
      } else if (error.code === 'auth/weak-password') {
        return { success: false, error: 'Password is too weak' };
      } else if (error.code === 'auth/invalid-email') {
        return { success: false, error: 'Please enter a valid email address' };
      } else {
        return { success: false, error: 'Failed to create account. Please try again.' };
      }
    }
  };

  const resetPassword = async (email) => {
    try {
      if (!email) return { success: false, error: 'Please enter your email' };
      if (!validateEmail(email)) return { success: false, error: 'Please enter a valid email address' };
      
      console.log('Attempting to send password reset email to:', email);
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent successfully');
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      if (error.code === 'auth/user-not-found') {
        return { success: false, error: 'No account found for this email' };
      } else if (error.code === 'auth/invalid-email') {
        return { success: false, error: 'Please enter a valid email address' };
      } else if (error.code === 'auth/too-many-requests') {
        return { success: false, error: 'Too many attempts. Please try again later.' };
      } else {
        return { success: false, error: `Could not send reset email: ${error.message}` };
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      if (!user) {
        console.error('No user found for profile update');
        return { success: false, error: 'User not authenticated' };
      }

      console.log('Updating profile for user:', user.id);
      console.log('Profile data:', profileData);

      const updatedData = {
        ...profileData,
        isProfileComplete: true,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, 'users', user.id), updatedData);
      console.log('Profile document updated in Firestore');

      // Update local state
      setUser(prev => ({ ...prev, ...updatedData }));
      setIsProfileComplete(true);
      console.log('Local state updated, isProfileComplete set to true');

      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  };

  const changePassword = async (_currentPassword, _newPassword) => {
    return { success: false, error: 'Password change requires re-authentication. Please sign out and sign in again.' };
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      isProfileComplete,
      login,
      signup,
      logout,
      updateProfile,
      changePassword,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 