// Event utilities for Cerco app

// Generate a unique event ID
export const generateEventId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Format event date and time
export const formatEventDateTime = (date, time) => {
  const eventDate = new Date(date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let dateDisplay;
  if (eventDate.toDateString() === today.toDateString()) {
    dateDisplay = 'Today';
  } else if (eventDate.toDateString() === tomorrow.toDateString()) {
    dateDisplay = 'Tomorrow';
  } else {
    dateDisplay = eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }

  return `${dateDisplay}, ${time}`;
};

// Validate event data
export const validateEventData = eventData => {
  const errors = [];

  if (!eventData.title?.trim()) {
    errors.push('Event title is required');
  }

  if (!eventData.locationDetails) {
    errors.push('Please select a valid location');
  }

  if (!eventData.date) {
    errors.push('Event date is required');
  }

  if (!eventData.time) {
    errors.push('Event time is required');
  }

  // Validate date is not in the past
  if (eventData.date) {
    const eventDate = new Date(eventData.date);
    const now = new Date();
    if (eventDate < now) {
      errors.push('Event date cannot be in the past');
    }
  }

  return errors;
};

// Calculate distance from user location to event
export const calculateEventDistance = (eventLocation, userLocation) => {
  if (!eventLocation || !userLocation) return null;

  const R = 3959; // Earth's radius in miles
  const lat1 = userLocation.latitude;
  const lon1 = userLocation.longitude;
  const lat2 = eventLocation.latitude;
  const lon2 = eventLocation.longitude;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

// Format distance for display
export const formatDistance = distance => {
  if (!distance) return null;

  if (distance < 0.1) {
    return `${Math.round(distance * 5280)} ft`;
  } else if (distance < 1) {
    return `${(distance * 10).toFixed(1)} mi`;
  } else {
    return `${distance.toFixed(1)} mi`;
  }
};

// Get event category color
export const getEventCategoryColor = category => {
  const colors = {
    Social: '#C1002F',
    Study: '#4CAF50',
    Sports: '#2196F3',
    Music: '#9C27B0',
    Food: '#FF9800',
    Other: '#607D8B',
  };
  return colors[category] || '#607D8B';
};

// Create a new event object
export const createNewEvent = (eventData, host) => {
  return {
    id: generateEventId(),
    title: eventData.title,
    description: eventData.description,
    location: eventData.locationDetails.name,
    locationDetails: eventData.locationDetails,
    date: eventData.date,
    time: eventData.time,
    category: eventData.category,
    maxAttendees: eventData.maxAttendees ? parseInt(eventData.maxAttendees) : null,
    host: host,
    attendees: 0,
    liked: false,
    createdAt: new Date().toISOString(),
  };
};
