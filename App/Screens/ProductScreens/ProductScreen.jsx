import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import axiosClient from "../../axios";
import Colors from "../../Utils/Colors";
import Loader from "../Loader/Loader";

const { width } = Dimensions.get("window");

export default function ProductScreen() {
  const [numColumns, setNumColumns] = useState(2);
  const [products, setProducts] = useState([]);
  const API_URL = process.env.REACT_NATIVE_API_URL;
  const [isLoading, setIsLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get("/api/getProducts");
      if (response.data.length < 1) {
        setIsLoading(true);
      } else {
        setProducts(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setIsLoading(false);
    }
  };

  const calculateFontSize = (text) => {
    // Adjust font size dynamically based on text length
    if (text.length < 20) {
      return 12;
    } else if (text.length < 40) {
      return 10;
    } else {
      return 8;
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={[styles.container]}>
      <Text style={[styles.title, { marginTop: 20, marginBottom: 20 }]}>
        Produktet
      </Text>
      {products === null || products === undefined || products.length < 1 ? (
        <Text
          style={{
            color: "white",
            textAlign: "center",
            marginTop: "5%",
            fontSize: 20,
          }}
        >
          Nuk ka të dhëna!
        </Text>
      ) : (
        <FlatList
          contentContainerStyle={styles.flatListContent}
          data={products}
          numColumns={numColumns}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => openModal(item)}
            >
              <Image
                source={{ uri: API_URL + item.image }}
                style={styles.image}
              />
              <View style={styles.textContainer}>
                <View style={styles.textWrapper}>
                  <Text
                    numberOfLines={3}
                    ellipsizeMode="tail"
                    style={[
                      styles.text,
                      { fontSize: calculateFontSize(item.name) },
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>
                <Text style={[styles.text, styles.textBold, { fontSize: 14 }]}>
                  {item.price}€
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedProduct && (
              <>
                <Image
                  source={{ uri: API_URL + selectedProduct.image }}
                  style={styles.modalImage}
                />
                <Text style={[styles.modalText, { fontWeight: "bold" }]}>
                  {selectedProduct.name}
                </Text>
                <Text style={styles.modalTextDescription}>
                  {selectedProduct.description}
                </Text>
                <Text style={[styles.modalText, { fontWeight: "bold" }]}>
                  {selectedProduct.price}€
                </Text>
              </>
            )}
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Mbylle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalImage: {
    width: 250,
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalText: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  modalTextDescription: {
    textAlign: "center",
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: Colors.GOLD,
  },
  closeButtonText: {
    color: Colors.BLACK,
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.BLACK,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.WHITE,
    textAlign: "left",
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
    margin: 10,
    width: width / 2 - 30,
  },
  image: {
    height: 200,
    width: "100%",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  textContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  textWrapper: {
    flex: 1,
  },
  text: {
    flexShrink: 1,
    lineHeight: 18, // Adjust line height for better readability
  },
  textBold: {
    fontWeight: "bold",
  },
});
