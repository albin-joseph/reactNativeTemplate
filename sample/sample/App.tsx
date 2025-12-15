/**
 * Main App Entry Point
 * Using layered, feature-first architecture
 */

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/state/store/store';
import RootNavigator from './src/presentation/navigation/RootNavigator';
import { ErrorBoundary } from './src/presentation/components';

const App = () => (
  <ErrorBoundary>
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  </ErrorBoundary>
);

export default App;
