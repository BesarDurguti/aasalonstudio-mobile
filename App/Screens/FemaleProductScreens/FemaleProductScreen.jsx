import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import axiosClient from "../../axios";
import Colors from "../../Utils/Colors";

export default function FemaleProductScreen() {
  const [numColumns, setNumColumns] = useState(2);
  const [products, setProducts] = useState([]);
  const API_URL = process.env.REACT_NATIVE_API_URL
  
  // const data = [
  //   {
  //     id: 1,
  //     title: "Product 1 \t 19.99$",
  //     imageUrl: require("../../../assets/Images/Photos/2.jpg"),
  //   },
  //   {
  //     id: 2,
  //     title: "Product 2 \t 19.99$",
  //     imageUrl: require("../../../assets/Images/Photos/3.jpg"),
  //   },
  //   {
  //     id: 3,
  //     title: "Product 3 \t 19.99$",
  //     imageUrl: require("../../../assets/Images/Photos/4.jpg"),
  //   },
  //   {
  //     id: 4,
  //     title: "Product 4 \t 19.99$",
  //     imageUrl: require("../../../assets/Images/Photos/5.jpg"),
  //   },
  //   {
  //     id: 5,
  //     title: "Product 5 \t 19.99$",
  //     imageUrl: require("../../../assets/Images/Photos/6.jpg"),
  //   },
  //   {
  //     id: 6,
  //     title: "Product 6 \t 19.99$",
  //     imageUrl: require("../../../assets/Images/Photos/7.jpg"),
  //   }
  // ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try{
      const response = await axiosClient.get('/api/getProducts');;
      setProducts(response.data);
    }catch(error){
      console.error('Error fetching products:', error)
    }
  }

  return (
    <View style={[styles.container]}>
     <Text style={styles.title}>Products</Text>
      <FlatList 
        contentContainerStyle={styles.flatListContent}
        data={products}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{uri: API_URL + item.image}} style={styles.image}/>
            <Text style={styles.text}>{item.name + '\t\t' + item.price}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE, // Set background color to black
  },
  flatListContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.GOLD,
    textAlign: 'left', // Align text to the left
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
  },
  image: {
    height: 160,
    width: 160,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  text: {
    fontSize: 12,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
    color: Colors.GOLD
  },
  marginTopP: {
    marginTop: 20,
  },
});