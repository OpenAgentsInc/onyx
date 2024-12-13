import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { observer } from 'mobx-react-lite';
import { pylonConfig } from '@/config/websocket';
import { useWebSocket } from '@/services/websocket/useWebSocket';
import { typography } from "@/theme"

interface Resource {
  name: string;
  uri: string;
  mime_type?: string;
}

interface ResourceResponse {
  jsonrpc: string;
  id: string;
  result: Resource[];
}

export const FileExplorer = observer(() => {
  const { state, listResources } = useWebSocket(pylonConfig);
  const [currentPath, setCurrentPath] = useState('.');
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state.connected) {
      fetchResources(currentPath);
    }
  }, [state.connected, currentPath]);

  const fetchResources = async (path: string) => {
    if (!state.connected || !listResources) return;

    setLoading(true);
    setError(null);

    try {
      const result = await listResources(path);
      console.log('Resources:', result);
      // Sort resources: directories first, then files, both alphabetically
      const sortedResources = [...result].sort((a, b) => {
        const aIsDir = !a.mime_type;
        const bIsDir = !b.mime_type;
        if (aIsDir && !bIsDir) return -1;
        if (!aIsDir && bIsDir) return 1;
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });
      setResources(sortedResources);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  const handleItemPress = (resource: Resource) => {
    if (!resource.mime_type) {
      // It's a directory - extract relative path from URI
      const url = new URL(resource.uri);
      const rootPath = '/Users/christopherdavid/code/pylon/';
      const relativePath = url.pathname.replace(rootPath, '');
      setCurrentPath(relativePath || '.');
    }
  };

  const handleBack = () => {
    if (currentPath === '.') return;
    const parentPath = currentPath.split('/').slice(0, -1).join('/') || '.';
    setCurrentPath(parentPath);
  };

  if (!state.connected) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Connecting to Pylon...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.pathText}>{currentPath}</Text>
      </View>

      {loading ? (
        <Text style={styles.text}>Loading...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView style={styles.list}>
          {resources.map((resource) => (
            <TouchableOpacity
              key={resource.uri}
              style={styles.item}
              onPress={() => handleItemPress(resource)}
            >
              <Text style={styles.itemText}>
                {resource.mime_type ? '📄 ' : '📁 '}
                {resource.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    marginRight: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: typography.primary.light,
  },
  pathText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: typography.primary.light,
    flex: 1,
  },
  list: {
    flex: 1,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  itemText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: typography.primary.light,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontFamily: typography.primary.light,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    fontFamily: typography.primary.light,
  },
});

export default FileExplorer;