import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Product } from "../productsType";
import { RootStackParamList } from "../../../navigation/RootNavigator";

interface Props {
  item: Product;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProductItem: React.FC<Props> = React.memo(({ item }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate("ProductDetail", { product: item });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text numberOfLines={2} style={styles.title}>
          {item.title}
        </Text>
        <Text style={styles.price}>₹ {item.price}</Text>
        <Text style={styles.rating}>
          ⭐ {item.rating.rate} ({item.rating.count})
        </Text>
      </View>
    </TouchableOpacity>
  );
});

export default ProductItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    borderRadius: 8,
    borderWidth: 1,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  price: {
    marginTop: 4,
    fontWeight: "bold",
  },
  rating: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
  },
});
