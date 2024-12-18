'use dom';

import * as React from "react"

export default function FeedbackScreen() {
  const styles = {
    container: {
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: 'jetBrainsMonoRegular, monospace',
      minHeight: '100vh',
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
    },
    text: {
      fontSize: '14px',
      lineHeight: '1.5',
    },
    sectionTitle: {
      fontFamily: 'jetBrainsMonoBold, monospace',
      fontSize: '16px',
      margin: '12px 0',
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.sectionTitle}>Feedback & Vision</h2>
      <p style={styles.text}>
        Question for you- Let's say you had a drone app fully built out and it was live to the
        public. Would there be any way to qualify the information people are adding to the graph?
        How could you prevent people from spamming or adding low-quality info?
      </p>
      <p style={styles.text}>
        Maybe a consensus mechanism, crowdsourced verification: a certain threshold of "likes"
        relative to post engagement could filter submissions. Another idea: a separate agent
        that breaks down knowledge graph submissions to see if they pass criteria of
        logicality/factuality/relevance.
      </p>
      <p style={styles.text}>
        You mentioned rewarding contributors with sats. This implies the agent has a pool of
        BTC either endowed at creation or earned via completing user inferences. How does this
        perspective fit into your vision for the project?
      </p>

      <p style={styles.text}>
        Share your thoughts or suggestions below. Future updates might allow interactive Q&A
        or submitting your own proposals.
      </p>
    </div>
  );
}