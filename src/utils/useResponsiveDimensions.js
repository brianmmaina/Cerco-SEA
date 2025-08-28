import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { useResponsive } from './responsive.js';

export const useResponsiveDimensions = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const responsive = useResponsive();

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  return {
    ...responsive,
    dimensions,
    isLandscape: dimensions.width > dimensions.height,
    isPortrait: dimensions.height > dimensions.width,
  };
}; 