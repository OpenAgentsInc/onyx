'use client';
'use dom';

import * as React from "react"
import { View, Text } from 'react-native';

export default function FeedbackScreen() {
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
      <Text style={styles.title}>Feedback & Vision</Text>
      <Text style={styles.text}>
        Question for you- Let's say you had a drone app fully built out and it was live to the
        public. Would there be any way to qualify the information people are adding to the graph?
        How could you prevent people from spamming or adding low-quality info?
      </Text>
      <Text style={styles.text}>
        Maybe a consensus mechanism, crowdsourced verification: a certain threshold of "likes"
        relative to post engagement could filter submissions. Another idea: a separate agent
        that breaks down knowledge graph submissions to see if they pass criteria of
        logicality/factuality/relevance.
      </Text>
      <Text style={styles.text}>
        You mentioned rewarding contributors with sats. This implies the agent has a pool of
        BTC either endowed at creation or earned via completing user inferences. How does this
        perspective fit into your vision for the project?
      </Text>

      <Text style={styles.text}>
        Share your thoughts or suggestions below. Future updates might allow interactive Q&A
        or submitting your own proposals.
      </Text>
    </View>
  );
}