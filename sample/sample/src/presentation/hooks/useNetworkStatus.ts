/**
 * Presentation Layer - Network Status Hook
 */

import { useState, useEffect } from 'react';
import { container } from '../../core/di/container';

export const useNetworkStatus = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const networkService = container.networkService;

    // Initial check
    networkService.isConnected().then((connected) => {
      setIsOffline(!connected);
    });

    // Subscribe to changes
    const unsubscribe = networkService.onConnectivityChange((connected) => {
      setIsOffline(!connected);
    });

    return unsubscribe;
  }, []);

  return { isOffline };
};
