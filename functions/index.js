const { onDocumentCreated, onDocumentUpdated } = require('firebase-functions/v2/firestore');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const admin = require('firebase-admin');

admin.initializeApp();

// Cloud Functions for Cerco App

// 1. Event Notification Function
// Triggers when a new event is created
exports.sendEventNotification = onDocumentCreated('events/{eventId}', async event => {
  try {
    const eventData = event.data.data();
    const eventId = event.params.eventId;

    console.log(`New event created: ${eventData.title} (ID: ${eventId})`);

    // Get all users who might be interested in this event
    const usersSnapshot = await admin
      .firestore()
      .collection('users')
      .where('notificationsEnabled', '==', true)
      .get();

    // Create notification for each user
    const batch = admin.firestore().batch();
    usersSnapshot.docs.forEach(userDoc => {
      const notificationRef = admin
        .firestore()
        .collection('users')
        .doc(userDoc.id)
        .collection('notifications')
        .doc();

      batch.set(notificationRef, {
        type: 'new_event',
        eventId: eventId,
        eventTitle: eventData.title,
        eventLocation: eventData.location,
        eventDate: eventData.date,
        message: `New event: ${eventData.title} at ${eventData.location}`,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
    console.log(`Sent notifications to ${usersSnapshot.size} users`);

    return { success: true, notificationsSent: usersSnapshot.size };
  } catch (error) {
    console.error('Error sending event notifications:', error);
    return { success: false, error: error.message };
  }
});

// 2. User Stats Update Function
// Triggers when an event is updated
exports.updateUserStats = onDocumentUpdated('events/{eventId}', async event => {
  try {
    const _beforeData = event.data.before.data(); // eslint-disable-line no-unused-vars
    const afterData = event.data.after.data();
    const _eventId = event.params.eventId; // eslint-disable-line no-unused-vars

    console.log(`Event updated: ${afterData.title} (ID: ${_eventId})`);

    // Update host stats if the event was created by a user
    if (afterData.hostId) {
      const hostRef = admin.firestore().collection('users').doc(afterData.hostId);

      await hostRef.update({
        eventsHosted: admin.firestore.FieldValue.increment(1),
        lastEventCreated: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Updated stats for host: ${afterData.hostId}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating user stats:', error);
    return { success: false, error: error.message };
  }
});

// 3. Data Cleanup Function
// Runs every 24 hours to clean up old events
exports.cleanupOldEvents = onSchedule('every 24 hours', async () => {
  try {
    const now = admin.firestore.Timestamp.now();
    const cutoffDate = new Date(now.toDate().getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

    console.log('Starting cleanup of old events...');

    const snapshot = await admin
      .firestore()
      .collection('events')
      .where('date', '<', cutoffDate)
      .get();

    if (snapshot.empty) {
      console.log('No old events to clean up');
      return { success: true, eventsDeleted: 0 };
    }

    const batch = admin.firestore().batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Cleaned up ${snapshot.size} old events`);

    return { success: true, eventsDeleted: snapshot.size };
  } catch (error) {
    console.error('Error cleaning up old events:', error);
    return { success: false, error: error.message };
  }
});

// 4. Event Attendance Tracking Function
// Triggers when event attendance is updated
exports.trackEventAttendance = onDocumentUpdated('events/{eventId}', async event => {
  try {
    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();
    const _eventId = event.params.eventId; // eslint-disable-line no-unused-vars

    // Check if attendees list changed
    const beforeAttendees = beforeData.attendees || [];
    const afterAttendees = afterData.attendees || [];

    if (beforeAttendees.length === afterAttendees.length) {
      return { success: true, message: 'No attendance changes' };
    }

    // Find new attendees
    const newAttendees = afterAttendees.filter(attendee => !beforeAttendees.includes(attendee));

    // Update stats for new attendees
    const batch = admin.firestore().batch();
    newAttendees.forEach(attendeeId => {
      const userRef = admin.firestore().collection('users').doc(attendeeId);
      batch.update(userRef, {
        eventsAttended: admin.firestore.FieldValue.increment(1),
        lastEventAttended: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
    console.log(`Updated attendance stats for ${newAttendees.length} users`);

    return { success: true, newAttendees: newAttendees.length };
  } catch (error) {
    console.error('Error tracking event attendance:', error);
    return { success: false, error: error.message };
  }
});
