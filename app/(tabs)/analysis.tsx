'use dom';

import * as React from "react"

export default function AnalysisScreen() {
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
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ fontFamily: 'jetBrainsMonoBold, monospace' }}>Drone Data Analysis</h2>
      <p style={styles.text}>
        Here you can view aggregated analyses of drone sightings, patterns in data, and
        other insights gleaned from the structured requests and responses in the marketplace.
      </p>
      <p style={styles.text}>
        Future enhancements: Graph visualizations, advanced queries, and automated inference
        on top of the curated data.
      </p>
    </div>
  );
}