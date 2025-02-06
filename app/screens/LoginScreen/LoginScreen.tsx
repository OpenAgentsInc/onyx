import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';

export function LoginScreen() {
  const { login } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const error = (route.params as any)?.error;

  return (
    <View className="flex-1 items-center justify-center bg-black p-4">
      <Text className="text-2xl font-bold text-white mb-8">
        Welcome to OpenAgents
      </Text>

      {error && (
        <Text className="text-red-500 mb-4 text-center">
          {error}
        </Text>
      )}

      <TouchableOpacity
        onPress={login}
        className="bg-white rounded-lg px-6 py-3 flex-row items-center"
      >
        <Text className="text-black font-semibold text-lg">
          Continue with GitHub
        </Text>
      </TouchableOpacity>
    </View>
  );
}