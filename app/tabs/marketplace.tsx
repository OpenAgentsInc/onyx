'use client';
'use dom';

import * as React from "react"
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
    overflowX: 'hidden' as const,
  },
  text: {
    fontFamily: 'jetBrainsMonoRegular, monospace',
    margin: '8px 0',
    color: '#fff',
    fontSize: '14px',
    lineHeight: '1.5' as const,
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
  sectionTitle: {
    fontFamily: 'jetBrainsMonoBold, monospace',
    fontSize: '16px',
    color: '#fff',
    margin: '12px 0',
  }
};

const droneRequestData = [
  ['REQUEST ID', 'DESCRIPTION', 'STATUS', 'BID'],
  [
    '#1001',
    'Drone sightings in rural Colorado (Jan 2024, CSV)',
    <>Pending <span style={{ backgroundColor: '#fff', color: '#000', padding: '0 0.5ch', fontSize: '12px', border: '1px solid #fff', marginLeft: '4px' }}>PENDING</span></>,
    '1500 sats'
  ],
  [
    '#1002',
    'Unidentified drones near LAX (Jan 2024, JSON)',
    <>Offer from @droneDataPro <span style={{ backgroundColor: '#fff', color: '#000', padding: '0 0.5ch', fontSize: '12px', border: '1px solid #fff', marginLeft: '4px' }}>OFFER</span></>,
    '2000 sats'
  ],
];

export default function MarketplaceScreen() {
  const [requestText, setRequestText] = React.useState('');

  return (
    <div style={styles.container}>
      <Card title="Onyx Data Marketplace">
        <p style={styles.text}>
          Welcome to the Onyx Data Marketplace! Here you can request drone sighting datasets—structured files with timestamps, coordinates, and notes—and pay providers who fulfill your request with Bitcoin over Lightning.
        </p>
        <p style={styles.text}>
          Post a new data request, view active requests and offers, and accept a provider's result to finalize payment.
        </p>
      </Card>

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

      <Card title="Submit a New Drone Data Request">
        <p style={styles.text}>
          Describe the data you need. For example: "A CSV of daily drone sightings in Denver, CO (January 2024), with timestamps and coordinates."
        </p>

        <div style={styles.textAreaContainer}>
          <TextArea
            placeholder="Enter your drone data request details..."
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
            autoPlay="I need a CSV file of daily drone sightings in Denver, CO (January 2024) including timestamps..."
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

      <div style={styles.sectionTitle}>Preferences</div>
      <p style={styles.text}>
        Customize your request: Choose data format, anonymity level, and verification requirements.
      </p>
      <p style={styles.text}>
        A future iteration might consider a mechanism where requests gain credibility if other users "like" or endorse them. Beyond a simple threshold of likes relative to engagement, a crowdsourced consensus mechanism could filter out spam or low-quality info before it enters the knowledge graph.
      </p>
      <p style={styles.text}>
        Once ready, post your updated request or revisit the active requests above.
      </p>
    </div>
  );
}
