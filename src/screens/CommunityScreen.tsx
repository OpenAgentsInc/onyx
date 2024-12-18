'use dom';

import * as React from "react"
import { Badge } from "@/components/Badge"
import Button from "@/components/Button"
import Card from "@/components/Card"
import { Checkbox } from "@/components/Checkbox"
import { DataTable } from "@/components/DataTable"
import { View } from "react-native"

export default function CommunityScreen() {
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

  const communityReports = [
    ['REPORT ID', 'LOCATION', 'VERIFIED'],
    ['#C-101', 'Denver, CO', <>Yes <Badge>VERIFIED</Badge></>],
    ['#C-102', 'Los Angeles, CA', 'No'],
    ['#C-103', 'Rural Colorado', 'No'],
  ];

  const [showOnlyVerified, setShowOnlyVerified] = React.useState(false);

  const filteredReports = showOnlyVerified
    ? communityReports.filter((_, i) => i === 0 || communityReports[i][2].toString().includes('VERIFIED'))
    : communityReports;

  return (
    <View style={styles.container}>
      <Card title="Community Reports">
        <p style={styles.text}>
          Browse community-submitted drone sightings. Use filters to refine results.
        </p>
      </Card>

      <Card title="Filters">
        <Checkbox
          name="verified"
          defaultChecked={showOnlyVerified}
          onChange={(e) => setShowOnlyVerified(e.target.checked)}
        >
          Show only verified reports
        </Checkbox>
      </Card>

      <Card title="Reports">
        <DataTable data={filteredReports} />
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <Button theme="PRIMARY" onClick={() => console.log('Refresh reports')}>
            Refresh
          </Button>
          <Button theme="SECONDARY" onClick={() => console.log('Load more')}>
            Load More
          </Button>
        </div>
      </Card>
    </View>
  );
}