import React from "react"
import {
  Modal, Pressable, StyleSheet, Text, TextInput, View
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

interface AddRepoModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (orgName: string, repoName: string, issueNumber: number) => void;
}

export const AddRepoModal = ({ visible, onClose, onSubmit }: AddRepoModalProps) => {
  const [orgName, setOrgName] = React.useState('');
  const [repoName, setRepoName] = React.useState('');
  const [issueNumber, setIssueNumber] = React.useState('');

  const handleSubmit = () => {
    const issueNum = parseInt(issueNumber, 10);
    if (!orgName || !repoName || isNaN(issueNum)) {
      // TODO: Add error handling
      return;
    }
    onSubmit(orgName, repoName, issueNum);
    setOrgName('');
    setRepoName('');
    setIssueNumber('');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Repository</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="white" />
            </Pressable>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Organization name (e.g. bitcoin)"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={orgName}
              onChangeText={setOrgName}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              style={[styles.input, styles.inputSpacing]}
              placeholder="Repository name (e.g. bitcoin)"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={repoName}
              onChangeText={setRepoName}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              style={[styles.input, styles.inputSpacing]}
              placeholder="Issue number (e.g. 31873)"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={issueNumber}
              onChangeText={setIssueNumber}
              keyboardType="number-pad"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          <Pressable
            style={[
              styles.submitButton,
              (!orgName || !repoName || !issueNumber) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Add Repository</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#0a0a0a',
    borderRadius: 18,
    width: '90%',
    maxWidth: 500,
    padding: 20,
    borderWidth: 1,
    borderColor: '#202020',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    color: 'white',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#202020',
  },
  inputSpacing: {
    marginTop: 12,
  },
  submitButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});
