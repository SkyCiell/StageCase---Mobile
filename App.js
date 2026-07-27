import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';

import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import ConcertDetailScreen from './src/screens/ConcertDetailScreen';
import MainTabs from './src/navigation/MainTabs';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isLoggedIn, isLoading } = useAuth();

  // Show nothing while loading auth state
  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#121A33' },
        animation: 'fade',
      }}
    >
      {!isLoggedIn ? (
        // Auth Stack
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        // Main App Stack with Tabs
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen 
            name="ConcertDetail" 
            component={ConcertDetailScreen}
            options={{ animation: 'slide_from_right' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
