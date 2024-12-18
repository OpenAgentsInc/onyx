'use dom';

import * as React from "react"

const radioStyles = {
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

interface RadioButtonProps {
  name: string;
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
  children?: React.ReactNode;
}

function RadioButton({ name, value, selected, onSelect, children }: RadioButtonProps) {
  const radioId = `${name}-${value}-radio`;

  const handleChange = () => {
    onSelect(value);
  };

  return (
    <div style={radioStyles.section}>
      <div style={{ position: 'relative' }}>
        <input
          style={radioStyles.input}
          id={radioId}
          type="radio"
          name={name}
          value={value}
          checked={selected}
          onChange={handleChange}
        />
        <label htmlFor={radioId} style={radioStyles.figure}>
          {selected ? '•' : '\u00A0'}
        </label>
      </div>
      <div style={radioStyles.right}>{children}</div>
    </div>
  );
}

interface RadioButtonGroupProps {
  options: { value: string; label: string }[];
  defaultValue?: string;
}

export function RadioButtonGroup({ options, defaultValue = '' }: RadioButtonGroupProps) {
  const [selectedValue, setSelectedValue] = React.useState<string>(defaultValue);
  const name = React.useMemo(() => `radioGroup-${Math.random()}`, []);

  return (
    <>
      {options.map((option) => (
        <RadioButton
          key={option.value}
          name={name}
          value={option.value}
          selected={selectedValue === option.value}
          onSelect={(val) => setSelectedValue(val)}
        >
          {option.label}
        </RadioButton>
      ))}
    </>
  );
}
