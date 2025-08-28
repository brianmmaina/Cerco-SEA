import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config.js';

const EventsContext = createContext();

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Listen for real-time updates from Firestore
  useEffect(() => {
    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const eventsData = [];
        snapshot.forEach(doc => {
          eventsData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setEvents(eventsData);
        setLoading(false);
      },
      error => {
        console.error('Error listening to events:', error);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const createEvent = async eventData => {
    try {
      const eventToSave = {
        ...eventData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        attendees: 0,
        attendeesList: [],
        likes: 0,
        likesList: [],
      };

      const docRef = await addDoc(collection(db, 'events'), eventToSave);
      return { success: true, eventId: docRef.id };
    } catch (error) {
      console.error('Error creating event:', error);
      return { success: false, error: error.message };
    }
  };

  const updateEvent = async (eventId, updates) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating event:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteEvent = async eventId => {
    try {
      await deleteDoc(doc(db, 'events', eventId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting event:', error);
      return { success: false, error: error.message };
    }
  };

  const joinEvent = async (eventId, userId) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const eventDoc = await getDoc(eventRef);

      if (!eventDoc.exists()) {
        return { success: false, error: 'Event not found' };
      }

      const eventData = eventDoc.data();
      const attendeesList = eventData.attendeesList || [];

      if (attendeesList.includes(userId)) {
        return { success: false, error: 'Already joined this event' };
      }

      await updateDoc(eventRef, {
        attendees: eventData.attendees + 1,
        attendeesList: [...attendeesList, userId],
        updatedAt: serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error('Error joining event:', error);
      return { success: false, error: error.message };
    }
  };

  const leaveEvent = async (eventId, userId) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const eventDoc = await getDoc(eventRef);

      if (!eventDoc.exists()) {
        return { success: false, error: 'Event not found' };
      }

      const eventData = eventDoc.data();
      const attendeesList = eventData.attendeesList || [];

      if (!attendeesList.includes(userId)) {
        return { success: false, error: 'Not joined this event' };
      }

      const updatedAttendeesList = attendeesList.filter(id => id !== userId);

      await updateDoc(eventRef, {
        attendees: Math.max(0, eventData.attendees - 1),
        attendeesList: updatedAttendeesList,
        updatedAt: serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error('Error leaving event:', error);
      return { success: false, error: error.message };
    }
  };

  const likeEvent = async (eventId, userId) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const eventDoc = await getDoc(eventRef);

      if (!eventDoc.exists()) {
        return { success: false, error: 'Event not found' };
      }

      const eventData = eventDoc.data();
      const likesList = eventData.likesList || [];

      if (likesList.includes(userId)) {
        // Unlike
        const updatedLikesList = likesList.filter(id => id !== userId);
        await updateDoc(eventRef, {
          likes: Math.max(0, eventData.likes - 1),
          likesList: updatedLikesList,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Like
        await updateDoc(eventRef, {
          likes: eventData.likes + 1,
          likesList: [...likesList, userId],
          updatedAt: serverTimestamp(),
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error liking event:', error);
      return { success: false, error: error.message };
    }
  };

  const getAllEvents = () => {
    return events;
  };

  const getEventById = eventId => {
    return events.find(event => event.id === eventId);
  };

  const getEventsByCategory = category => {
    return events.filter(event => event.category === category);
  };

  const getEventsByUser = userId => {
    return events.filter(event => event.createdBy === userId);
  };

  return (
    <EventsContext.Provider
      value={{
        events,
        loading,
        createEvent,
        updateEvent,
        deleteEvent,
        joinEvent,
        leaveEvent,
        likeEvent,
        getAllEvents,
        getEventById,
        getEventsByCategory,
        getEventsByUser,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};
