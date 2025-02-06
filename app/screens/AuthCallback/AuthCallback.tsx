import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export function AuthCallback() {
  const { handleAuthCallback } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    async function handleCallback() {
      try {
        // Get code from URL params
        const params = route.params as { code?: string };
        if (!params?.code) {
          throw new Error('No authorization code received');
        }

        // Handle the auth callback
        await handleAuthCallback(params.code);

        // Navigate to main app
        navigation.navigate('Main');
      } catch (error) {
        console.error('Auth callback error:', error);
        navigation.navigate('Login', {
          error: 'Authentication failed. Please try again.',
        });
      }
    }

    handleCallback();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <ActivityIndicator size="large" color="#ffffff" />
      <Text className="mt-4 text-white">Completing authentication...</Text>
    </View>
  );
}