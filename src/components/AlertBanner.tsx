'use dom';

import * as React from "react"

const alertBannerStyles = {
  root: {
    fontFamily: 'jetBrainsMonoRegular, monospace',
    fontSize: '14px',
    padding: '8px',
    margin: '20px 0',
    backgroundColor: '#ff0',
    color: '#000',
    border: '1px solid #fff',
  }
};

interface AlertBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'SUCCESS' | 'ERROR';
}

export function AlertBanner({ type, children, style: propStyle, ...rest }: AlertBannerProps) {
  let background = '#ff0';
  let shadowColor = '#fff';

  if (type === 'SUCCESS') {
    background = '#0f0';
    shadowColor = '#0c0';
  } else if (type === 'ERROR') {
    background = '#f00';
    shadowColor = '#c00';
  }

  const mergedStyle: React.CSSProperties = {
    ...alertBannerStyles.root,
    ...propStyle,
    backgroundColor: background,
    boxShadow: `1ch 1ch 0 0 ${shadowColor}`,
  };

  return (
    <div style={mergedStyle} {...rest}>
      {children}
    </div>
  );
}
