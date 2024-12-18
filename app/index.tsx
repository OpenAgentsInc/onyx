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
  },
  textAreaContainer: {
    marginTop: '20px',
  },
  hr: {
    border: 'none',
    borderBottom: '1px solid #fff',
    margin: '20px 0'
  }
};

const sampleData = [
  ['REQUEST ID', 'DESCRIPTION', 'STATUS', 'BID (SATS)'],
  ['2458', 'Daily COVID-19 case counts in California (CSV)', 'Pending offers', '1500'],
  ['2460', 'Historical Bitcoin price data (Jan 2020 - Dec 2021, JSON)', 'Offer from @dataNode99', '2000'],
];

export default function Index() {
  const [requestText, setRequestText] = React.useState('');

  return (
    <div style={styles.container}>
      <Card title="Onyx Data Marketplace">
        <p style={styles.text}>
          Welcome to the Onyx Data Marketplace! Here you can request any type of data—structured files, analytics,
          reports—and pay providers who fulfill your request with Bitcoin over Lightning.
        </p>
        <p style={styles.text}>
          Post a new data request, view active requests and bids, then accept a provider's result to pay them.
        </p>
      </Card>

      <div style={{ height: 20 }} />

      <Card title="Active Data Requests">
        <p style={styles.text}>Below is a summary of your currently active data requests:</p>
        <DataTable data={sampleData} />
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

      <Card title="Submit a New Data Request">
        <p style={styles.text}>
          Describe the data you need. For example: "Daily weather data for Denver, CO (Jan 1, 2023 - Feb 1, 2023, CSV)"
          and how many sats you're willing to pay.
        </p>

        <div style={styles.textAreaContainer}>
          <TextArea
            placeholder="Enter your data request details..."
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
            autoPlay="I need a CSV file of daily weather data for Denver, CO from Jan 1, 2023 to Feb 1, 2023..."
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
