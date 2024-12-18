import * as React from 'react';
import { AppRegistry } from 'react-native';
import Router from '@/components/Router';

function App() {
  return (
    <Router />
  );
}

AppRegistry.registerComponent('onyx', () => App);

export default App;