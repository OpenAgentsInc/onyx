'use client';
'use dom';
import * as React from "react"

export default function CommunityScreen() {
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
      <h2 style={{ fontFamily: 'jetBrainsMonoBold, monospace' }}>Community Reports</h2>
      <p style={styles.text}>
        View and interact with community-submitted drone sightings. Engage with
        other contributors, add verification, or endorse high-quality reports.
      </p>
      <p style={styles.text}>
        Eventually, we might implement a crowdsourced consensus mechanism to qualify
        information. A threshold of likes relative to post engagement or a separate
        agent checking for logicality could maintain data quality.
      </p>
    </div>
  );
}
