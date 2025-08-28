// Location utilities for Cerco app

// Validate coordinates
export const validateCoordinates = (latitude, longitude) => {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lng)) {
    return { valid: false, error: 'Coordinates must be valid numbers' };
  }

  if (lat < -90 || lat > 90) {
    return { valid: false, error: 'Latitude must be between -90 and 90' };
  }

  if (lng < -180 || lng > 180) {
    return { valid: false, error: 'Longitude must be between -180 and 180' };
  }

  return { valid: true, latitude: lat, longitude: lng };
};

// Format coordinates for display
export const formatCoordinates = (latitude, longitude) => {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (isNaN(lat) || isNaN(lng)) return 'Invalid coordinates';

  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';

  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959; // Earth's radius in miles
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

// Popular locations around the world for quick reference
export const popularLocations = {
  'New York City': { lat: 40.7128, lng: -74.006 },
  'Los Angeles': { lat: 34.0522, lng: -118.2437 },
  Chicago: { lat: 41.8781, lng: -87.6298 },
  Houston: { lat: 29.7604, lng: -95.3698 },
  Phoenix: { lat: 33.4484, lng: -112.074 },
  Philadelphia: { lat: 39.9526, lng: -75.1652 },
  'San Antonio': { lat: 29.4241, lng: -98.4936 },
  'San Diego': { lat: 32.7157, lng: -117.1611 },
  Dallas: { lat: 32.7767, lng: -96.797 },
  'San Jose': { lat: 37.3382, lng: -121.8863 },
  London: { lat: 51.5074, lng: -0.1278 },
  Paris: { lat: 48.8566, lng: 2.3522 },
  Tokyo: { lat: 35.6762, lng: 139.6503 },
  Sydney: { lat: -33.8688, lng: 151.2093 },
  Toronto: { lat: 43.6532, lng: -79.3832 },
};

// Get coordinates for a popular location
export const getPopularLocationCoords = locationName => {
  return popularLocations[locationName] || null;
};

// Generate a unique location ID
export const generateLocationId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Create a location object
export const createLocation = (name, address, latitude, longitude) => {
  const validation = validateCoordinates(latitude, longitude);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return {
    id: generateLocationId(),
    name: name.trim(),
    address: address.trim() || name.trim(),
    latitude: validation.latitude,
    longitude: validation.longitude,
    createdAt: new Date().toISOString(),
  };
};
