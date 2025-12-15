/**
 * Platform Layer - Network Service Implementation
 */

import NetInfo from '@react-native-community/netinfo';
import { INetworkService } from './INetworkService';

export class NetworkService implements INetworkService {
  async isConnected(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  }

  onConnectivityChange(callback: (isConnected: boolean) => void): () => void {
    const unsubscribe = NetInfo.addEventListener((state) => {
      callback(state.isConnected ?? false);
    });
    return unsubscribe;
  }
}
