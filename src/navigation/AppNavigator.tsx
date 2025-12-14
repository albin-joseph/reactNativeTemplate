/**
 * Navigation Setup
 * 
 * Demonstrates:
 * - Type-safe navigation with TypeScript
 * - Stack navigator configuration
 * - Screen options
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { PaginatedListScreen } from '../screens/PaginatedListScreen';
import { CachedDataScreen } from '../screens/CachedDataScreen';
import { JSChallengesScreen } from '../screens/JSChallengesScreen';
import { LoginForm } from '../components/LoginForm';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'RN Interview Prep',
          }}
        />

        <Stack.Screen
          name="PaginatedList"
          component={PaginatedListScreen}
          options={{
            title: 'Paginated List',
          }}
        />

        <Stack.Screen
          name="CachedData"
          component={CachedDataScreen}
          options={{
            title: 'Cached Data',
          }}
        />

        <Stack.Screen
          name="LoginForm"
          component={LoginForm}
          options={{
            title: 'Login Form',
          }}
        />

        <Stack.Screen
          name="JSChallenges"
          component={JSChallengesScreen}
          options={{
            title: 'JS Challenges',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
