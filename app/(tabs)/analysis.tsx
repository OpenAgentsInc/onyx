'use client';
'use dom';
import * as React from "react"
import { View, Text } from 'react-native';

export default function AnalysisScreen() {
  const styles = {
    container: {
      backgroundColor: '#000',
      flex: 1,
      padding: 20,
      maxWidth: 800,
      alignSelf: 'center',
    },
    title: {
      color: '#fff',
      fontFamily: 'jetBrainsMonoBold',
      fontSize: 20,
      marginBottom: 16,
    },
    text: {
      color: '#fff',
      fontFamily: 'jetBrainsMonoRegular',
      fontSize: 14,
      lineHeight: 21,
      marginBottom: 12,
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drone Data Analysis</Text>
      <Text style={styles.text}>
        Here you can view aggregated analyses of drone sightings, patterns in data, and
        other insights gleaned from the structured requests and responses in the marketplace.
      </Text>
      <Text style={styles.text}>
        Future enhancements: Graph visualizations, advanced queries, and automated inference
        on top of the curated data.
      </Text>
    </View>
  );
}