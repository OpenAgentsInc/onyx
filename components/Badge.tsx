'use dom';

import * as React from "react"

const badgeStyles = {
  root: {
    display: 'inline-block',
    backgroundColor: '#fff',
    color: '#000',
    padding: '0 0.5ch',
    fontFamily: 'jetBrainsMonoRegular, monospace',
    fontSize: '12px',
    border: '1px solid #fff',
    marginLeft: '4px',
  }
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

export function Badge({ children, ...rest }: BadgeProps) {
  return (
    <span style={badgeStyles.root} {...rest}>
      {children}
    </span>
  );
}
