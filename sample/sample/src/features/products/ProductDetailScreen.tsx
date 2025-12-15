import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { addToCart } from "../cart/cartSlice";

type Props = NativeStackScreenProps<RootStackParamList, "ProductDetail">;

const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { product } = route.params;
  const dispatch = useAppDispatch();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    dispatch(addToCart(product));

    setTimeout(() => {
      setIsAdding(false);
      Alert.alert(
        "Added to Cart",
        `${product.title} has been added to your cart.`,
        [
          { text: "Continue Shopping", style: "cancel" },
          { text: "View Cart", onPress: () => navigation.navigate("Cart") },
        ]
      );
    }, 300);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.title}>{product.title}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>${product.price}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {product.rating.rate}</Text>
            <Text style={styles.ratingCount}>({product.rating.count} reviews)</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>

        <TouchableOpacity
          style={[styles.addToCartButton, isAdding && styles.addToCartButtonDisabled]}
          onPress={handleAddToCart}
          disabled={isAdding}
        >
          <Text style={styles.addToCartButtonText}>
            {isAdding ? "Adding..." : "Add to Cart"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
  },
  category: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 24,
  },
  addToCartButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  addToCartButtonDisabled: {
    backgroundColor: "#999",
  },
  addToCartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
