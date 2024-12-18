'use client';
'use dom';
import * as React from "react"
import { View, Text } from 'react-native';

export default function CommunityScreen() {
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
      <Text style={styles.title}>Community Reports</Text>
      <Text style={styles.text}>
        View and interact with community-submitted drone sightings. Engage with
        other contributors, add verification, or endorse high-quality reports.
      </Text>
      <Text style={styles.text}>
        Eventually, we might implement a crowdsourced consensus mechanism to qualify
        information. A threshold of likes relative to post engagement or a separate
        agent checking for logicality could maintain data quality.
      </Text>
    </View>
  );
}