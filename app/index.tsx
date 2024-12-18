'use dom';

import * as React from "react"
import Button from "@/components/Button"
import Card from "@/components/Card"
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

export default function Index() {
  const [requestText, setRequestText] = React.useState('');

  return (
    <div style={styles.container}>
      <Card title="Data Marketplace Demo">
        <p style={styles.text}>
          Welcome to the Onyx Data Marketplace! Here you can request any type of data—structured files, analytics, reports—and pay providers who fulfill your request with Bitcoin over Lightning.
        </p>
        <p style={styles.text}>
          Below are sample listings and your request panel. Post a data request, view open bids, or accept a provider's result.
        </p>
      </Card>

      <div style={{ height: 20 }} />

      <Card title="Active Data Requests">
        <p style={styles.text}>
          <strong>Request #2458:</strong> "Daily COVID-19 case counts in California (CSV format)"
        </p>
        <p style={styles.text}>Status: Pending provider offers</p>
        <p style={styles.text}>Offered Bid: 1500 sats</p>
        <div style={styles.buttonContainer}>
          <Button theme="PRIMARY" onClick={() => console.log('View Request #2458')}>View</Button>
          <Button theme="SECONDARY" onClick={() => console.log('Increase Bid')}>Increase Bid</Button>
        </div>

        <hr style={styles.hr} />

        <p style={styles.text}>
          <strong>Request #2460:</strong> "Historical Bitcoin price data (Jan 2020 - Dec 2021) in JSON"
        </p>
        <p style={styles.text}>Status: Offer received by @dataNode99</p>
        <p style={styles.text}>Offered Bid: 2000 sats</p>
        <div style={styles.buttonContainer}>
          <Button theme="PRIMARY" onClick={() => console.log('Accept Offer from @dataNode99')}>Accept Offer</Button>
          <Button theme="SECONDARY" onClick={() => console.log('View Provider Reputation')}>Provider Info</Button>
        </div>
      </Card>

      <div style={{ height: 20 }} />

      <Card title="Submit a New Data Request">
        <p style={styles.text}>
          Describe the data you need. Include format, desired date range, and any special requirements. Set a bid to attract providers.
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
