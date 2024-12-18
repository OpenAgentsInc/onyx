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
} satisfies Record<string, CSSProperties>;

// Add global styles for active state
const globalStyles = `
  button:active {
    opacity: 0.8;
  }
`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: 'PRIMARY' | 'SECONDARY';
  isDisabled?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ theme = 'PRIMARY', isDisabled, children, style, ...rest }) => {
  // Add global styles on mount
  React.useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = globalStyles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const buttonStyle: CSSProperties = {
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