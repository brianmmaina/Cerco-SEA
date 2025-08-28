import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { useAuth } from './AuthContext.js';

const CommentsContext = createContext();

export const CommentsProvider = ({ children }) => {
  const [comments, setComments] = useState({});
  const { user } = useAuth();

  // Listen for real-time updates from Firestore
  useEffect(() => {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = {};
      snapshot.forEach((doc) => {
        const comment = { id: doc.id, ...doc.data() };
        const eventId = comment.eventId;
        if (!commentsData[eventId]) {
          commentsData[eventId] = [];
        }
        commentsData[eventId].push(comment);
      });
      setComments(commentsData);
    }, (error) => {
      console.error('Error listening to comments:', error);
    });

    return unsubscribe;
  }, []);

  const getCommentsForEvent = (eventId) => {
    return comments[eventId] || [];
  };

  const addComment = async (eventId, commentText) => {
    if (!user || !commentText.trim()) {
      return { success: false, error: 'Invalid comment or user not authenticated' };
    }

    try {
      const newComment = {
        eventId,
        userId: user.id,
        userName: user.name || 'Anonymous',
        userAvatar: user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
        comment: commentText.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'comments'), newComment);
      return { success: true, comment: { id: docRef.id, ...newComment } };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, error: 'Failed to add comment' };
    }
  };

  const deleteComment = async (eventId, commentId) => {
    try {
      await deleteDoc(doc(db, 'comments', commentId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting comment:', error);
      return { success: false, error: 'Failed to delete comment' };
    }
  };

  const updateCommentTimeAgo = (comment) => {
    if (!comment.createdAt) return 'Just now';
    
    const now = new Date();
    const commentTime = comment.createdAt.toDate ? comment.createdAt.toDate() : new Date(comment.createdAt);
    const diffInMinutes = Math.floor((now - commentTime) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  };

  const refreshCommentTimes = () => {
    // This will trigger a re-render with updated times
    setComments({ ...comments });
  };

  return (
    <CommentsContext.Provider value={{
      comments,
      getCommentsForEvent,
      addComment,
      deleteComment,
      updateCommentTimeAgo,
      refreshCommentTimes,
    }}>
      {children}
    </CommentsContext.Provider>
  );
};

export const useComments = () => {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error('useComments must be used within a CommentsProvider');
  }
  return context;
}; 