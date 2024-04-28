import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import axiosClient from "../../axios";
import Colors from "../../Utils/Colors";

export default function ProductScreen() {
  const [numColumns, setNumColumns] = useState(2);
  const [products, setProducts] = useState([]);
  const API_URL = process.env.REACT_NATIVE_API_URL;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosClient.get("/api/getProducts");

      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <View style={[styles.container]}>
      <Text style={styles.title}>Produktet</Text>
      <FlatList
        contentContainerStyle={styles.flatListContent}
        data={products}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image
              source={{ uri: API_URL + item.image }}
              style={styles.image}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width:'100%'
              }}
            >
              <Text style={styles.text}>{item.name}</Text>
              <Text style={[styles.text, styles.textBold]}>{item.price}€</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.BLACK, // Set background color to black
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.WHITE,
    textAlign: "left", // Align text to the left
  },
  itemContainer: {
    backgroundColor: Colors.WHITE,
    marginBottom: 20,
    borderRadius: 6,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 10, // Add margin for spacing between products
    width: "44%",
  },
  image: {
    height: 200,
    width: "100%",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  text: {
    fontSize: 12,
    padding:10
  },
  textBold: {
    fontWeight: "bold",
    fontSize: 14
  },
  marginTopP: {
    marginTop: 20,
  },
});
