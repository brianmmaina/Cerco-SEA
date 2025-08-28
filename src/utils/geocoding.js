// Geocoding service using Google Maps Geocoding API
import { GOOGLE_MAPS_API_KEY } from '../config/apiKeys';

export const geocodeAddress = async (address) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      const location = result.geometry.location;
      
      return {
        success: true,
        latitude: location.lat,
        longitude: location.lng,
        formattedAddress: result.formatted_address,
        placeId: result.place_id,
        types: result.types,
      };
    } else {
      return {
        success: false,
        error: `Geocoding failed: ${data.status}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `Network error: ${error.message}`,
    };
  }
};

export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      
      return {
        success: true,
        address: result.formatted_address,
        placeId: result.place_id,
        types: result.types,
      };
    } else {
      return {
        success: false,
        error: `Reverse geocoding failed: ${data.status}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `Network error: ${error.message}`,
    };
  }
};

export const searchPlaces = async (query, location = null) => {
  try {
    let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`;
    
    if (location) {
      url += `&location=${location.latitude},${location.longitude}&radius=50000`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK') {
      return {
        success: true,
        places: data.results.map(place => ({
          name: place.name,
          address: place.formatted_address,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          placeId: place.place_id,
          types: place.types,
          rating: place.rating,
          photos: place.photos,
        })),
      };
    } else {
      return {
        success: false,
        error: `Place search failed: ${data.status}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `Network error: ${error.message}`,
    };
  }
};

// Fallback geocoding for when Google API is not available
export const fallbackGeocode = (address) => {
  // Simple fallback for common BU locations
  const buLocations = {
    'bu student center': { lat: 42.3500, lng: -71.1050 },
    'mugar library': { lat: 42.3510, lng: -71.1040 },
    'bu fitness center': { lat: 42.3490, lng: -71.1060 },
    'starbucks bu': { lat: 42.3505, lng: -71.1045 },
    'warren towers': { lat: 42.3520, lng: -71.1030 },
    'marsh chapel': { lat: 42.3480, lng: -71.1070 },
    'bu beach': { lat: 42.3495, lng: -71.1055 },
    'cas building': { lat: 42.3515, lng: -71.1035 },
  };
  
  const searchTerm = address.toLowerCase();
  for (const [key, coords] of Object.entries(buLocations)) {
    if (searchTerm.includes(key)) {
      return {
        success: true,
        latitude: coords.lat,
        longitude: coords.lng,
        formattedAddress: address,
      };
    }
  }
  
  return {
    success: false,
    error: 'Location not found in fallback database',
  };
}; 