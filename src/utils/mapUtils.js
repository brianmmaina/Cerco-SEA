// Map utilities for Cerco app

// Boston University campus boundaries
export const BU_CAMPUS_BOUNDS = {
  northEast: {
    latitude: 42.3550,
    longitude: -71.1000,
  },
  southWest: {
    latitude: 42.3450,
    longitude: -71.1100,
  },
};

// Popular BU locations
export const BU_LOCATIONS = {
  studentCenter: {
    name: 'BU Student Center',
    coordinate: { latitude: 42.3500, longitude: -71.1050 },
  },
  mugarLibrary: {
    name: 'Mugar Library',
    coordinate: { latitude: 42.3510, longitude: -71.1040 },
  },
  fitnessCenter: {
    name: 'BU Fitness Center',
    coordinate: { latitude: 42.3490, longitude: -71.1060 },
  },
  starbucks: {
    name: 'Starbucks on Campus',
    coordinate: { latitude: 42.3505, longitude: -71.1045 },
  },
  warrenTowers: {
    name: 'Warren Towers',
    coordinate: { latitude: 42.3520, longitude: -71.1030 },
  },
  marshChapel: {
    name: 'Marsh Chapel',
    coordinate: { latitude: 42.3480, longitude: -71.1070 },
  },
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

// Format distance for display
export const formatDistance = (distance) => {
  if (distance < 0.1) {
    return `${Math.round(distance * 5280)} ft`;
  } else if (distance < 1) {
    return `${(distance * 10).toFixed(1)} mi`;
  } else {
    return `${distance.toFixed(1)} mi`;
  }
};

// Get marker color based on event popularity
export const getMarkerColor = (attendees) => {
  if (attendees > 20) return '#C1002F'; // Red for popular events
  if (attendees > 10) return '#FFC72C'; // Gold for medium events
  return '#4CAF50'; // Green for small events
};

// Check if a coordinate is within BU campus
export const isWithinBUCampus = (coordinate) => {
  return (
    coordinate.latitude >= BU_CAMPUS_BOUNDS.southWest.latitude &&
    coordinate.latitude <= BU_CAMPUS_BOUNDS.northEast.latitude &&
    coordinate.longitude >= BU_CAMPUS_BOUNDS.southWest.longitude &&
    coordinate.longitude <= BU_CAMPUS_BOUNDS.northEast.longitude
  );
};

// Get random coordinate within BU campus
export const getRandomBULocation = () => {
  const locations = Object.values(BU_LOCATIONS);
  return locations[Math.floor(Math.random() * locations.length)];
};

// Default map region centered on BU
export const DEFAULT_MAP_REGION = {
  latitude: 42.3500,
  longitude: -71.1050,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
}; 