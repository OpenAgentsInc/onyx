'use dom';

import * as React from 'react';
import { typography } from "@/theme/typography";

const styles = {
  card: {
    position: 'relative',
    display: 'block',
    padding: '0 1ch calc(8px * 1.5) 1ch',
    backgroundColor: '#000',
    color: '#fff',
    fontFamily: typography.primary.normal,
  },
  children: {
    boxShadow: 'inset 1px 0 0 0 #fff, inset -1px 0 0 0 #fff, 0 1px 0 0 #fff',
    display: 'block',
    padding: 'calc(8px * 1.5) 2ch calc(16px * 1.5) 2ch',
    overflowX: 'auto',
    overflowY: 'hidden',
  },
  action: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  left: {
    minWidth: '10%',
    width: '100%',
    boxShadow: 'inset 1px 0 0 0 #fff, inset 0 1px 0 0 #fff',
    padding: 'calc(8px * 1.5) 2ch 0px 1ch',
  },
  right: {
    minWidth: '10%',
    width: '100%',
    boxShadow: 'inset -1px 0 0 0 #fff, inset 0 1px 0 0 #fff',
    padding: 'calc(8px * 1.5) 2ch 0px 1ch',
  },
  title: {
    flexShrink: 0,
    padding: '0 1ch',
    fontSize: '16px',
    fontWeight: 400,
    margin: 0,
    fontFamily: typography.primary.bold,
    color: '#fff',
  },
  container: {
    padding: '20px',
    backgroundColor: '#000',
    minHeight: '100vh',
  },
  text: {
    fontFamily: typography.primary.normal,
    margin: '8px 0',
    color: '#fff',
  }
};

interface CardProps {
  children?: React.ReactNode;
  title?: string;
  mode?: 'left' | 'right';
}

const Card: React.FC<CardProps> = ({ children, mode, title }) => {
  let titleElement = (
    <header style={styles.action}>
      <div style={styles.left} aria-hidden="true"></div>
      <h2 style={styles.title}>{title}</h2>
      <div style={styles.right} aria-hidden="true"></div>
    </header>
  );

  return (
    <article style={styles.card}>
      {titleElement}
      <section style={styles.children}>{children}</section>
    </article>
  );
};

export default function Index() {
  return (
    <div style={styles.container}>
      <Card title="Recent Drone Sightings">
        <p style={styles.text}>January 15, 2024 - Multiple drones spotted over Denver airspace</p>
        <p style={styles.text}>January 14, 2024 - Unidentified drone activity reported near LAX</p>
        <p style={styles.text}>January 12, 2024 - Drone swarm observed in rural Colorado</p>
      </Card>
      
      <div style={{ height: 20 }} />
      
      <Card title="Latest Analysis">
        <p style={styles.text}>Pattern suggests coordinated activity across multiple states</p>
        <p style={styles.text}>Most sightings occur between 2-4am local time</p>
        <p style={styles.text}>Average flight duration: 45 minutes</p>
      </Card>
      
      <div style={{ height: 20 }} />
      
      <Card title="Community Reports">
        <p style={styles.text}>87 verified sightings this month</p>
        <p style={styles.text}>23 pending verification</p>
        <p style={styles.text}>12 video submissions under review</p>
      </Card>
    </div>
  );
}