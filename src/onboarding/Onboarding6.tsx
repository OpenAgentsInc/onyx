'use dom'

import * as React from "react"
import { Text, TextStyle, View } from "react-native"
import Button from "@/components/Button"
import Card from "@/components/Card"
import { useRouterStore } from "@/store/useRouterStore"

export default function Onboarding6() {
  const navigate = useRouterStore(state => state.navigate);
  const [showRestore, setShowRestore] = React.useState(false);

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
      fontSize: 14,
      lineHeight: 1.5,
      color: '#fff',
      fontFamily: 'jetBrainsMonoRegular, monospace',
      marginBottom: 12,
    } as TextStyle,
    highlight: {
      fontSize: 14,
      color: '#4CAF50',
      fontFamily: 'jetBrainsMonoRegular, monospace',
      marginBottom: 12,
    } as TextStyle,
    buttonContainer: {
      marginTop: '20px',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    walletButtons: {
      marginTop: '20px',
      gap: '12px',
    }
  }

  return (
    <div style={styles.container}>
      <Card title="Bitcoin Wallet Setup">
        <Text style={styles.text}>
          Onyx integrates with Bitcoin & Lightning. Earn or pay sats for services.
        </Text>
        <View style={styles.walletButtons}>
          <Button
            theme="PRIMARY"
            onClick={() => navigate('WalletSetup')}
          >
            Create New Wallet
          </Button>
          <Button
            theme="SECONDARY"
            onClick={() => setShowRestore(true)}
          >
            Restore Existing Wallet
          </Button>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            theme="SECONDARY"
            onClick={() => navigate('Onboarding5')}
          >
            Back
          </Button>
          <Button
            theme="PRIMARY"
            onClick={() => navigate('Onboarding7')}
          >
            Skip for Now
          </Button>
        </View>
      </Card>
    </div>
  );
}