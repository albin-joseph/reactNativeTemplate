/**
 * Platform Layer - Network Status Interface
 */

export interface INetworkService {
  isConnected(): Promise<boolean>;
  onConnectivityChange(callback: (isConnected: boolean) => void): () => void;
}
