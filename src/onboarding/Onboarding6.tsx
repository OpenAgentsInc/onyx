'use dom'

import * as React from "react"
import Button from "@/components/Button"
import Card from "@/components/Card"
import { useRouterStore } from "@/store/useRouterStore"
import { CSSProperties } from "react"

export default function Onboarding6() {
  const navigate = useRouterStore(state => state.navigate);
  const [showRestore, setShowRestore] = React.useState(false);

  const styles: Record<string, CSSProperties> = {
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
      lineHeight: '24px',
      color: '#fff',
      fontFamily: 'jetBrainsMonoRegular, monospace',
      marginBottom: '24px',
      display: 'block',
    },
    cardContent: {
      padding: '24px',
      backgroundColor: '#111',
      borderRadius: '12px',
      marginBottom: '24px',
    },
    walletButtons: {
      marginTop: '32px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
    },
    buttonContainer: {
      marginTop: '32px',
      display: 'flex',
      flexDirection: 'row' as const,
      justifyContent: 'space-between',
      gap: '16px',
    }
  }

  return (
    <div style={styles.container}>
      <Card title="Bitcoin Wallet Setup">
        <div style={styles.cardContent}>
          <p style={styles.text}>
            Onyx integrates with Bitcoin & Lightning. Earn or pay sats for services.
          </p>
          
          <div style={styles.walletButtons}>
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
          </div>
          
          <div style={styles.buttonContainer}>
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
          </div>
        </div>
      </Card>
    </div>
  );
}