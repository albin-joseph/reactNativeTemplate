/**
 * Environment Configuration
 * Centralized configuration for different environments
 */

export enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

interface EnvConfig {
  apiBaseUrl: string;
  apiTimeout: number;
  enableLogging: boolean;
  environment: Environment;
}

const DEV_CONFIG: EnvConfig = {
  apiBaseUrl: 'https://fakestoreapi.com',
  apiTimeout: 10000,
  enableLogging: true,
  environment: Environment.DEVELOPMENT,
};

const STAGING_CONFIG: EnvConfig = {
  apiBaseUrl: 'https://fakestoreapi.com',
  apiTimeout: 10000,
  enableLogging: true,
  environment: Environment.STAGING,
};

const PROD_CONFIG: EnvConfig = {
  apiBaseUrl: 'https://fakestoreapi.com',
  apiTimeout: 15000,
  enableLogging: false,
  environment: Environment.PRODUCTION,
};

// Determine current environment
const getCurrentEnvironment = (): Environment => {
  // In a real app, this would check process.env or react-native-config
  return __DEV__ ? Environment.DEVELOPMENT : Environment.PRODUCTION;
};

const getConfig = (): EnvConfig => {
  const env = getCurrentEnvironment();
  
  switch (env) {
    case Environment.DEVELOPMENT:
      return DEV_CONFIG;
    case Environment.STAGING:
      return STAGING_CONFIG;
    case Environment.PRODUCTION:
      return PROD_CONFIG;
    default:
      return DEV_CONFIG;
  }
};

export const config = getConfig();
