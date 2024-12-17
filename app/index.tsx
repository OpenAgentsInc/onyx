'use dom';

import * as React from 'react';

const styles = {
  card: {
    position: 'relative',
    display: 'block',
    padding: '0 1ch calc(8px * 1.5) 1ch',
    backgroundColor: '#000',
    color: '#fff',
    fontFamily: 'jetBrainsMonoRegular, monospace',
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
    fontSize: '14px',
    fontWeight: 400,
    margin: 0,
    fontFamily: 'jetBrainsMonoBold, monospace',
    color: '#fff',
    minWidth: 'fit-content',
  },
  container: {
    padding: '20px',
    backgroundColor: '#000',
    minHeight: '100vh',
    maxWidth: '800px',
    margin: '0 auto',
  },
  text: {
    fontFamily: 'jetBrainsMonoRegular, monospace',
    margin: '8px 0',
    color: '#fff',
    fontSize: '14px',
  },
  buttonRoot: {
    verticalAlign: 'top',
    display: 'inline-block',
    fontWeight: 400,
    textAlign: 'center',
    margin: '0',
    outline: '0',
    border: '0',
    fontFamily: 'jetBrainsMonoRegular, monospace',
    width: '100%',
    fontSize: '12px',
    lineHeight: '32px',
    height: '32px',
    padding: '0 2ch',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: '200ms ease all',
    cursor: 'pointer',
  },
  buttonPrimary: {
    backgroundColor: '#fff',
    color: '#000',
  },
  buttonSecondary: {
    backgroundColor: '#000',
    color: '#fff',
    boxShadow: 'inset 0 0 0 1px #fff',
  },
  buttonDisabled: {
    backgroundColor: '#333',
    color: '#666',
    cursor: 'not-allowed',
  },
  buttonContainer: {
    marginTop: '20px',
    display: 'flex',
    gap: '10px',
  }
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: 'PRIMARY' | 'SECONDARY';
  isDisabled?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ theme = 'PRIMARY', isDisabled, children, style, ...rest }) => {
  const buttonStyle = {
    ...styles.buttonRoot,
    ...(theme === 'PRIMARY' ? styles.buttonPrimary : styles.buttonSecondary),
    ...(isDisabled ? styles.buttonDisabled : {}),
    ...style,
  };

  if (isDisabled) {
    return <div style={buttonStyle}>{children}</div>;
  }

  return (
    <button style={buttonStyle} role="button" tabIndex={0} disabled={isDisabled} {...rest}>
      {children}
    </button>
  );
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
      <Card title="Drone Sightings">
        <p style={styles.text}>January 15, 2024 - Multiple drones spotted over Denver airspace</p>
        <p style={styles.text}>January 14, 2024 - Unidentified drone activity reported near LAX</p>
        <p style={styles.text}>January 12, 2024 - Drone swarm observed in rural Colorado</p>
        <div style={styles.buttonContainer}>
          <Button theme="PRIMARY" onClick={() => console.log('View Details')}>View Details</Button>
          <Button theme="SECONDARY" onClick={() => console.log('Report Similar')}>Report Similar</Button>
        </div>
      </Card>
      
      <div style={{ height: 20 }} />
      
      <Card title="Latest Analysis">
        <p style={styles.text}>Pattern suggests coordinated activity across multiple states</p>
        <p style={styles.text}>Most sightings occur between 2-4am local time</p>
        <p style={styles.text}>Average flight duration: 45 minutes</p>
        <div style={styles.buttonContainer}>
          <Button theme="PRIMARY" onClick={() => console.log('View Full Analysis')}>View Full Analysis</Button>
          <Button theme="SECONDARY" isDisabled>Download Data</Button>
        </div>
      </Card>
      
      <div style={{ height: 20 }} />
      
      <Card title="Community Reports">
        <p style={styles.text}>87 verified sightings this month</p>
        <p style={styles.text}>23 pending verification</p>
        <p style={styles.text}>12 video submissions under review</p>
        <div style={styles.buttonContainer}>
          <Button theme="PRIMARY" onClick={() => console.log('Submit Report')}>Submit Report</Button>
          <Button theme="SECONDARY" onClick={() => console.log('View All')}>View All</Button>
        </div>
      </Card>
    </div>
  );
}