/**
 * Presentation Layer - Root Navigator
 * Main navigation configuration
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductsListScreen from '../screens/ProductsListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import { Product } from '../../domain/entities/Product';
import { useAppSelector } from '../hooks';
import { selectCartTotalItems } from '../../state/selectors';

export type RootStackParamList = {
  Products: undefined;
  ProductDetail: { product: Product };
  Cart: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const CartButton = ({ navigation }: any) => {
  const totalItems = useAppSelector(selectCartTotalItems);

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Cart')}
      style={styles.cartButton}
      accessibilityRole="button"
      accessibilityLabel={`Shopping cart with ${totalItems} items`}
    >
      <Text style={styles.cartIcon}>🛒</Text>
      {totalItems > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalItems}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Products"
          component={ProductsListScreen}
          options={({ navigation }) => ({
            title: 'Products',
            headerRight: () => <CartButton navigation={navigation} />,
          })}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={({ navigation }) => ({
            title: 'Product Details',
            headerRight: () => <CartButton navigation={navigation} />,
          })}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ title: 'Shopping Cart' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({
  cartButton: {
    marginRight: 16,
    position: 'relative',
  },
  cartIcon: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#D32F2F',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
