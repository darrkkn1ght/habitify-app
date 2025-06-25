import React, { useContext, useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import Context
import { HabitsContext } from '../context/HabitsContext';

// Import Navigation Stacks
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';

// Import React Native components
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const Stack = createStackNavigator();

// Loading Screen Component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#6366f1" />
    <Text style={styles.loadingText}>Loading Habitify...</Text>
  </View>
);

// Main App Navigator
const AppNavigator = () => {
  const { user, loading } = useContext(HabitsContext);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('hasLaunched').then(value => {
      if (value == null) {
        AsyncStorage.setItem('hasLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  // Show loading screen while checking auth state and first launch
  if (loading || isFirstLaunch === null) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // User is not authenticated - show auth stack
        <Stack.Screen 
          name="Auth" 
          component={AuthStack}
          options={{
            animationTypeForReplace: !user ? 'pop' : 'push',
          }}
        />
      ) : (
        // User is authenticated - show main app
        <Stack.Screen 
          name="Main" 
          component={MainTabs}
        />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default AppNavigator;