import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function MainAppScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Cerco!</Text>
      <Text style={styles.subtitle}>You&apos;re all set up and ready to go.</Text>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Feed</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Map</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Calendar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222222',
    textAlign: 'center',
    marginTop: 100,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 50,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 50,
  },
  tab: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minWidth: 80,
    alignItems: 'center',
  },
  tabText: {
    color: '#222222',
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#B00020',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 