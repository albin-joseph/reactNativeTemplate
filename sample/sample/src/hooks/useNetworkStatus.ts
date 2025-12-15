import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

export const useNetworkStatus = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Fetch initial network state
    NetInfo.fetch().then((state) => {
      const offline =
        !state.isConnected || state.isInternetReachable === false;
      setIsOffline(offline);
    });

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline =
        !state.isConnected || state.isInternetReachable === false;
      setIsOffline(offline);
    });

    return () => unsubscribe();
  }, []);

  return { isOffline };
};
