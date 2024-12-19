'use dom';

import * as React from 'react';
import type { CSSProperties } from 'react';

const styles = {
  buttonRoot: {
    verticalAlign: 'top',
    display: 'inline-block',
    fontWeight: 400,
    textAlign: 'center' as const,
    margin: '0',
    outline: '0',
    border: '0',
    fontFamily: 'jetBrainsMonoRegular, monospace',
    width: '100%',
    fontSize: '12px',
    lineHeight: '32px',
    height: '32px',
    padding: '0 2ch',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    transition: '200ms ease all',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
    MozUserSelect: 'none' as const,
    msUserSelect: 'none' as const,
    WebkitTouchCallout: 'none' as const,
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
  buttonActive: {
    opacity: 0.8,
  }
} satisfies Record<string, CSSProperties>;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: 'PRIMARY' | 'SECONDARY';
  isDisabled?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ theme = 'PRIMARY', isDisabled, children, style, ...rest }) => {
  const [isActive, setIsActive] = React.useState(false);

  const buttonStyle: CSSProperties = {
    ...styles.buttonRoot,
    ...(theme === 'PRIMARY' ? styles.buttonPrimary : styles.buttonSecondary),
    ...(isDisabled ? styles.buttonDisabled : {}),
    ...(isActive ? styles.buttonActive : {}),
    ...style,
  };

  if (isDisabled) {
    return <div style={buttonStyle}>{children}</div>;
  }

  return (
    <button 
      style={buttonStyle} 
      role="button" 
      tabIndex={0} 
      disabled={isDisabled} 
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;