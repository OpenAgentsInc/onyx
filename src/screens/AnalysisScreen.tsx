'use dom';

import * as React from "react"
import Card from "@/components/Card"
import { Checkbox } from "@/components/Checkbox"
import { DataTable } from "@/components/DataTable"
import { RadioButtonGroup } from "@/components/RadioButtonGroup"
import { View } from "react-native"

export default function AnalysisScreen() {
  const styles = {
    container: {
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: 'jetBrainsMonoRegular, monospace',
      minHeight: '100vh',
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
    },
    text: {
      fontSize: '14px',
      lineHeight: '1.5',
    },
    sectionTitle: {
      fontFamily: 'jetBrainsMonoBold, monospace',
      fontSize: '16px',
      margin: '12px 0',
    }
  };

  const sampleData = [
    ['METRIC', 'VALUE'],
    ['Total Drones Analyzed', '234'],
    ['Unique Operators Identified', '15'],
    ['Suspicious Patterns', '3'],
  ];

  const [includeAnomalies, setIncludeAnomalies] = React.useState(true);
  const [selectedFormat, setSelectedFormat] = React.useState<string>('');

  return (
    <View style={styles.container}>
      <Card title="Drone Data Analysis">
        <p style={styles.text}>
          Here's a snapshot of recent analytical metrics derived from drone data.
          Customize filters and formats below.
        </p>
        <DataTable data={sampleData} />
      </Card>

      <Card title="Filters & Options">
        <p style={styles.text}>
          Refine your analysis:
        </p>
        <Checkbox
          name="anomalies"
          defaultChecked={includeAnomalies}
          onChange={(e) => setIncludeAnomalies(e.target.checked)}
        >
          Include anomalies
        </Checkbox>

        <p style={{ ...styles.text, marginTop: '12px' }}>Preferred Data Format:</p>
        <RadioButtonGroup
          options={[
            { value: 'json', label: 'JSON' },
            { value: 'csv', label: 'CSV' },
            { value: 'xml', label: 'XML' },
          ]}
          defaultValue={selectedFormat}
        />
      </Card>

      <Card title="Next Steps">
        <p style={styles.text}>
          Apply these settings to refine your final data output. Additional tools may become available as the MCP and DVM integrations mature.
        </p>
      </Card>
    </View>
  );
}