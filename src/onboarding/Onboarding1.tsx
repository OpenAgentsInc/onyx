import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useRouterStore } from '@/store/useRouterStore';

export default function Onboarding1() {
  const navigate = useRouterStore(state => state.navigate);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Card title="Welcome to Onyx">
          <Text style={styles.text}>
            Welcome to Onyx! Let's get started with a brief intro.
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              theme="PRIMARY"
              onPress={() => navigate('Onboarding2')}
            >
              Next
            </Button>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 21,
    fontFamily: 'jetBrainsMonoRegular',
  },
  buttonContainer: {
    marginTop: 20,
  }
});