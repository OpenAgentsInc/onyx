'use dom';

import * as React from "react"
import { Badge } from "@/components/Badge"
import Button from "@/components/Button"
import Card from "@/components/Card"
import { DataTable } from "@/components/DataTable"
import TextArea from "@/components/TextArea"

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#000',
    minHeight: '100vh',
    maxWidth: '800px',
    margin: '0 auto',
    overflowX: 'hidden', // ensure no horizontal overflow
  },
  text: {
    fontFamily: 'jetBrainsMonoRegular, monospace',
    margin: '8px 0',
    color: '#fff',
    fontSize: '14px',
  },
  buttonContainer: {
    marginTop: '20px',
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const,
  },
  textAreaContainer: {
    marginTop: '20px',
  },
};

const droneRequestData = [
  ['REQUEST ID', 'DESCRIPTION', 'STATUS', 'BID'],
  [
    '#1001',
    'Drone sightings in rural Colorado (Jan 2024, CSV)',
    <>Pending<Badge>PENDING</Badge></>,
    '1500 sats'
  ],
  [
    '#1002',
    'Unidentified drones near LAX (Jan 2024, JSON)',
    <>Offer from @droneDataPro<Badge>OFFER</Badge></>,
    '2000 sats'
  ],
];

export default function Index() {
  const [requestText, setRequestText] = React.useState('');

  return (
    <div style={styles.container}>
      <Card title="Onyx Data Marketplace">
        <p style={styles.text}>
          Welcome to the Onyx Data Marketplace! Here you can request drone sighting datasets—structured files with timestamps and coordinates—and pay providers who fulfill your request with Bitcoin over Lightning.
        </p>
        <p style={styles.text}>
          Post a new data request, view active requests and offers, then accept a provider's result and pay them.
        </p>
      </Card>

      <div style={{ height: 20 }} />

      <Card title="Active Drone Data Requests">
        <p style={styles.text}>Below is a summary of your currently active requests:</p>
        <DataTable data={droneRequestData} />
        <div style={styles.buttonContainer}>
          <Button theme="PRIMARY" onClick={() => console.log('View Selected Request')}>
            View Selected
          </Button>
          <Button theme="SECONDARY" onClick={() => console.log('Increase Bid')}>
            Increase Bid
          </Button>
        </div>
      </Card>

      <div style={{ height: 20 }} />

      <Card title="Submit a New Drone Data Request">
        <p style={styles.text}>
          Describe the drone data you need. For example: "I need a CSV file of daily drone sightings
          in Denver, CO from January 2024, including timestamps and coordinates."
        </p>

        <div style={styles.textAreaContainer}>
          <TextArea
            placeholder="Enter your drone data request details..."
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
            autoPlay="I need a CSV file of daily drone sightings in Denver, CO (January 2024)..."
            style={{
              minHeight: '100px',
              boxShadow: 'inset 0 0 0 1px #fff',
              padding: '12px',
              color: '#fff',
              fontFamily: 'jetBrainsMonoRegular, monospace',
              fontSize: '14px',
            }}
          />
        </div>

        <div style={styles.buttonContainer}>
          <Button
            theme="PRIMARY"
            onClick={() => {
              console.log('Posting new request:', requestText);
              setRequestText('');
            }}
          >
            Post Request
          </Button>
          <Button theme="SECONDARY" onClick={() => console.log('View Marketplace')}>View Marketplace</Button>
        </div>
      </Card>
    </div>
  );
}
