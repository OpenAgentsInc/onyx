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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '-7px',
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
    lineHeight: '14px',
  },
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

export default Card;