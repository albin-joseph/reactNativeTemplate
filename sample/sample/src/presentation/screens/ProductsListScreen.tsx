/**
 * Presentation Layer - Products List Screen
 * TODO: Copy content from src/features/products/productsListScreen.tsx
 * and update imports according to MIGRATION_GUIDE.md
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProductsListScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Products List Screen - Migration in progress
      </Text>
      <Text style={styles.subtext}>
        See MIGRATION_GUIDE.md for migration instructions
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default ProductsListScreen;
