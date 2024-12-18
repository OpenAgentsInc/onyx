'use dom';

import * as React from "react"

const tableStyles = {
  root: {
    borderCollapse: 'collapse' as const,
    width: '100%',
    maxWidth: '64ch',
    margin: '20px 0',
    fontFamily: 'jetBrainsMonoRegular, monospace',
    fontSize: '14px',
    color: '#fff',
  },
  headerCell: {
    borderBottom: '1px solid #fff',
    padding: '4px 8px',
    fontWeight: 700,
  },
  cell: {
    borderBottom: '1px solid #333',
    padding: '4px 8px',
    verticalAlign: 'top' as const,
  },
};

interface DataTableProps {
  data: string[][];
}

export function DataTable({ data }: DataTableProps) {
  if (!data || data.length === 0) {
    return null;
  }

  const header = data[0];
  const rows = data.slice(1);

  return (
    <table style={tableStyles.root}>
      <thead>
        <tr>
          {header.map((cell, index) => (
            <th key={index} style={tableStyles.headerCell}>{cell}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rIndex) => (
          <tr key={rIndex}>
            {row.map((cell, cIndex) => (
              <td key={cIndex} style={tableStyles.cell}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
