'use dom';

import * as React from "react"

const checkboxStyles = {
  section: {
    display: 'flex',
    alignItems: 'flex-start' as const,
    margin: '4px 0',
    fontFamily: 'jetBrainsMonoRegular, monospace',
    fontSize: '14px',
    color: '#fff',
  },
  figure: {
    display: 'inline-block',
    width: '1ch',
    textAlign: 'center' as const,
    marginRight: '8px',
    boxShadow: 'inset 0 0 0 1px #fff',
    cursor: 'pointer',
    userSelect: 'none' as const,
  },
  input: {
    position: 'absolute' as const,
    left: '-9999px',
  },
  right: {
    display: 'inline-block',
    verticalAlign: 'top' as const,
    cursor: 'pointer',
    userSelect: 'none' as const,
  }
};

interface CheckboxProps {
  style?: React.CSSProperties;
  name: string;
  defaultChecked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
}

export function Checkbox({ style, name, defaultChecked = false, onChange, children }: CheckboxProps) {
  const checkboxId = `${name}-checkbox`;
  const [isChecked, setIsChecked] = React.useState(defaultChecked);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    onChange?.(event);
  };

  return (
    <div style={{ ...checkboxStyles.section, ...style }}>
      <div style={{ position: 'relative' }}>
        <input
          style={checkboxStyles.input}
          id={checkboxId}
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          onChange={handleChange}
        />
        <label htmlFor={checkboxId} style={checkboxStyles.figure}>
          {isChecked ? '╳' : '\u00A0'}
        </label>
      </div>
      <div style={checkboxStyles.right}>{children}</div>
    </div>
  );
}
