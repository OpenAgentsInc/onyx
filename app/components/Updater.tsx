import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Clipboard } from 'react-native';
import { useUpdates } from 'expo-updates';
import * as Updates from 'expo-updates';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from './Text';

export const Updater = () => {
  const {
    availableUpdate,
    checkError,
    currentlyRunning,
    downloadedUpdate,
    downloadError,
    initializationError,
    isChecking,
    isDownloading,
    isUpdateAvailable,
    isUpdatePending,
    lastCheckForUpdateTimeSinceRestart,
  } = useUpdates();

  const handleCheckUpdate = async () => {
    if (__DEV__) {
      console.log('Update checking disabled in development');
      return;
    }

    try {
      const result = await Updates.checkForUpdateAsync();
      console.log('Update check result:', result);
      
      // If an update is available, download and reload automatically
      if (result.isAvailable) {
        console.log('Update available, downloading...');
        const downloadResult = await Updates.fetchUpdateAsync();
        console.log('Update download result:', downloadResult);
        if (downloadResult) {
          console.log('Reloading with new update...');
          await Updates.reloadAsync();
        }
      }
    } catch (error) {
      console.error('Error checking/downloading update:', error);
    }
  };

  useEffect(() => {
    if (__DEV__) {
      console.log('Update checking disabled in development');
      return;
    }

    const interval = setInterval(handleCheckUpdate, 5000);
    // Run check immediately on mount
    handleCheckUpdate();
    return () => clearInterval(interval);
  }, []);

  const handleManualDownload = async () => {
    if (__DEV__) {
      console.log('Update downloading disabled in development');
      return;
    }

    try {
      const result = await Updates.fetchUpdateAsync();
      console.log('Update download result:', result);
      if (result) {
        await Updates.reloadAsync();
      }
    } catch (error) {
      console.error('Error downloading update:', error);
    }
  };

  const handleCopyToClipboard = async (value: any) => {
    const stringValue = typeof value === 'object' ? JSON.stringify(value, null, 2) : value.toString();
    await Clipboard.setString(stringValue);
  };

  const InfoRow = ({ label, value, showCopy = false }: { label: string; value: any; showCopy?: boolean }) => {
    if (value === undefined) return null;
    return (
      <View style={styles.row}>
        <Text style={styles.label} text={`${label}:`} />
        <View style={styles.valueContainer}>
          <Text
            style={styles.value}
            text={value === null ? 'null' :
                  typeof value === 'boolean' ? value.toString() :
                  typeof value === 'object' ? JSON.stringify(value, null, 2) :
                  value.toString()}
          />
          {showCopy && (
            <TouchableOpacity 
              onPress={() => handleCopyToClipboard(value)}
              style={styles.copyButton}
            >
              <MaterialCommunityIcons name="clipboard-outline" size={16} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (__DEV__) {
    return (
      <View style={styles.container}>
        <View style={styles.devMessage}>
          <Text text="Updates are disabled in development mode" style={styles.devMessageText} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, isChecking && styles.buttonDisabled]} 
          onPress={handleCheckUpdate}
          disabled={isChecking}
        >
          <Text style={styles.buttonText} text={isChecking ? 'Checking...' : 'Check for Update'} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.button, 
            (!isUpdateAvailable || isDownloading) && styles.buttonDisabled
          ]} 
          onPress={handleManualDownload}
          disabled={!isUpdateAvailable || isDownloading}
        >
          <Text style={styles.buttonText} text={isDownloading ? 'Downloading...' : 'Download & Reload'} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <InfoRow label="Check Error" value={checkError} />
        <InfoRow label="Download Error" value={downloadError} />
        <InfoRow label="Initialization Error" value={initializationError} />
        <InfoRow label="Is Checking" value={isChecking} />
        <InfoRow label="Is Downloading" value={isDownloading} />
        <InfoRow label="Update Available" value={isUpdateAvailable} />
        <InfoRow label="Update Pending" value={isUpdatePending} />
        <InfoRow label="Last Check Time" value={lastCheckForUpdateTimeSinceRestart} />
        <InfoRow label="Available Update" value={availableUpdate} />
        <InfoRow label="Downloaded Update" value={downloadedUpdate} />
        <InfoRow label="Currently Running" value={currentlyRunning} showCopy={true} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  button: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#666',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'JetBrainsMono',
    fontSize: 14,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  row: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 8,
  },
  label: {
    color: '#fff',
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: 14,
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  value: {
    color: '#ccc',
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 12,
    flex: 1,
  },
  copyButton: {
    padding: 4,
    marginLeft: 8,
  },
  devMessage: {
    padding: 16,
    backgroundColor: '#333',
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  devMessageText: {
    color: '#fff',
    fontFamily: 'JetBrainsMono',
    fontSize: 14,
  },
});