import * as React from 'react';
import { AppRegistry, StatusBar } from 'react-native';
import Router from '@/components/Router';

function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Router />
    </>
  );
}

AppRegistry.registerComponent('main', () => App);

export default App;