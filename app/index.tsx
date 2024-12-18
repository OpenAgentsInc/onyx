'use dom';

import * as React from 'react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import TextArea from '@/components/TextArea';

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
  }
};

export default function Index() {
  const [reportText, setReportText] = React.useState('');

  return (
    <div style={styles.container}>
      <Card title="Drone Sightings">
        <p style={styles.text}>January 15, 2024 - Multiple drones spotted over Denver airspace</p>
        <p style={styles.text}>January 14, 2024 - Unidentified drone activity reported near LAX</p>
        <p style={styles.text}>January 12, 2024 - Drone swarm observed in rural Colorado</p>
        <div style={styles.buttonContainer}>
          <Button theme="PRIMARY" onClick={() => console.log('View Details')}>View Details</Button>
          <Button theme="SECONDARY" onClick={() => console.log('Report')}>Report</Button>
        </div>
      </Card>
      
      <div style={{ height: 20 }} />
      
      <Card title="Latest Analysis">
        <p style={styles.text}>Pattern suggests coordinated activity across multiple states</p>
        <p style={styles.text}>Most sightings occur between 2-4am local time</p>
        <p style={styles.text}>Average flight duration: 45 minutes</p>
        <div style={styles.buttonContainer}>
          <Button theme="PRIMARY" onClick={() => console.log('View Full Analysis')}>View Analysis</Button>
          <Button theme="SECONDARY" isDisabled>Download</Button>
        </div>
      </Card>
      
      <div style={{ height: 20 }} />
      
      <Card title="Community Reports">
        <p style={styles.text}>87 verified sightings this month</p>
        <p style={styles.text}>23 pending verification</p>
        <p style={styles.text}>12 video submissions under review</p>
        
        <div style={styles.textAreaContainer}>
          <TextArea
            placeholder="Enter your report details..."
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            autoPlay="Spotted three drones hovering at approximately 500ft altitude..."
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
              console.log('Submitting report:', reportText);
              setReportText('');
            }}
          >
            Submit
          </Button>
          <Button theme="SECONDARY" onClick={() => console.log('View All')}>View All</Button>
        </div>
      </Card>
    </div>
  );
}