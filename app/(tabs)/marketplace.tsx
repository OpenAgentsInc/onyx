'use client';
'use dom';

import * as React from "react"
import Button from "@/components/Button"
import Card from "@/components/Card"
import { DataTable } from "@/components/DataTable"
import TextArea from "@/components/TextArea"
import { View } from 'react-native';

const styles = {
  container: {
    padding: 20,
    backgroundColor: '#000',
    minHeight: '100%',
    maxWidth: 800,
    margin: 0,
    flex: 1,
  },
  text: {
    fontFamily: 'jetBrainsMonoRegular',
    margin: 8,
    color: '#fff',
    fontSize: 14,
    lineHeight: 1.5,
  },
  buttonContainer: {
    marginTop: 20,
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },
  textAreaContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontFamily: 'jetBrainsMonoBold',
    fontSize: 16,
    color: '#fff',
    margin: 12,
  }
};

const droneRequestData = [
  ['REQUEST ID', 'DESCRIPTION', 'STATUS', 'BID'],
  [
    '#1001',
    'Drone sightings in rural Colorado (Jan 2024, CSV)',
    'PENDING',
    '1500 sats'
  ],
  [
    '#1002',
    'Unidentified drones near LAX (Jan 2024, JSON)',
    'OFFER',
    '2000 sats'
  ],
];

export default function MarketplaceScreen() {
  const [requestText, setRequestText] = React.useState('');

  return (
    <View style={styles.container}>
      <Card title="Onyx Data Marketplace">
        <Text style={styles.text}>
          Welcome to the Onyx Data Marketplace! Here you can request drone sighting datasets—structured files with timestamps, coordinates, and notes—and pay providers who fulfill your request with Bitcoin over Lightning.
        </Text>
        <Text style={styles.text}>
          Post a new data request, view active requests and offers, and accept a provider's result to finalize payment.
        </Text>
      </Card>

      <Card title="Active Drone Data Requests">
        <Text style={styles.text}>Below is a summary of your currently active requests:</Text>
        <DataTable data={droneRequestData} />
        <View style={styles.buttonContainer}>
          <Button theme="PRIMARY" onPress={() => console.log('View Selected Request')}>
            View Selected
          </Button>
          <Button theme="SECONDARY" onPress={() => console.log('Increase Bid')}>
            Increase Bid
          </Button>
        </View>
      </Card>

      <Card title="Submit a New Drone Data Request">
        <Text style={styles.text}>
          Describe the data you need. For example: "A CSV of daily drone sightings in Denver, CO (January 2024), with timestamps and coordinates."
        </Text>

        <View style={styles.textAreaContainer}>
          <TextArea
            placeholder="Enter your drone data request details..."
            value={requestText}
            onChangeText={setRequestText}
            style={{
              minHeight: 100,
              borderWidth: 1,
              borderColor: '#fff',
              padding: 12,
              color: '#fff',
              fontFamily: 'jetBrainsMonoRegular',
              fontSize: 14,
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            theme="PRIMARY"
            onPress={() => {
              console.log('Posting new request:', requestText);
              setRequestText('');
            }}
          >
            Post Request
          </Button>
          <Button theme="SECONDARY" onPress={() => console.log('View Marketplace')}>
            View Marketplace
          </Button>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Preferences</Text>
      <Text style={styles.text}>
        Customize your request: Choose data format, anonymity level, and verification requirements.
      </Text>
      <Text style={styles.text}>
        A future iteration might consider a mechanism where requests gain credibility if other users "like" or endorse them. Beyond a simple threshold of likes relative to engagement, a crowdsourced consensus mechanism could filter out spam or low-quality info before it enters the knowledge graph.
      </Text>
      <Text style={styles.text}>
        Once ready, post your updated request or revisit the active requests above.
      </Text>
    </View>
  );
}