import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useResponsiveDimensions } from '../utils/useResponsiveDimensions.js';

export const ResponsiveContainer = ({ 
  children, 
  style, 
  padding = 'md',
  maxWidth,
  center = false,
  ...props 
}) => {
  const { isTablet, spacing, responsiveWidth } = useResponsiveDimensions();

  const getPadding = () => {
    switch (padding) {
      case 'xs': return spacing.xs;
      case 'sm': return spacing.sm;
      case 'lg': return spacing.lg;
      case 'xl': return spacing.xl;
      default: return spacing.md;
    }
  };

  const containerStyle = [
    styles.container,
    {
      paddingHorizontal: isTablet ? spacing.xl : getPadding(),
      maxWidth: maxWidth ? responsiveWidth(maxWidth) : undefined,
      alignSelf: center ? 'center' : undefined,
    },
    style,
  ];

  return (
    <View style={containerStyle} {...props}>
      {children}
    </View>
  );
};

export const ResponsiveRow = ({ 
  children, 
  style, 
  justifyContent = 'space-between',
  alignItems = 'center',
  gap,
  ...props 
}) => {
  const { spacing } = useResponsiveDimensions();

  const rowStyle = [
    styles.row,
    {
      justifyContent,
      alignItems,
      gap: gap ? spacing[gap] || gap : undefined,
    },
    style,
  ];

  return (
    <View style={rowStyle} {...props}>
      {children}
    </View>
  );
};

export const ResponsiveGrid = ({ 
  children, 
  columns = 2,
  gap = 'md',
  style,
  ...props 
}) => {
  const { isTablet, spacing } = useResponsiveDimensions();
  
  const gridColumns = isTablet ? Math.max(columns, 2) : 1;
  const gridGap = spacing[gap] || spacing.md;

  const gridStyle = [
    styles.grid,
    {
      gap: gridGap,
    },
    style,
  ];

  return (
    <View style={gridStyle} {...props}>
      {React.Children.map(children, (child) => (
        <View style={{ flex: 1 / gridColumns }}>
          {child}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
}); 