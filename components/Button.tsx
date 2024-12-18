'use dom';

import * as React from 'react';

const styles = {
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
    whiteSpace: 'nowrap',
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

export default Button;