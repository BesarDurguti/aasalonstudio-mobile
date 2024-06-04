import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, Image, StyleSheet, Dimensions } from "react-native";
import axiosClient from "../../axios";
import Colors from "../../Utils/Colors";
import { UserContext } from "../../store/UserContext";
import Loader from "../Loader/Loader";


const { width } = Dimensions.get('window');

export default function ProductScreen() {
  const [numColumns, setNumColumns] = useState(2);
  const [products, setProducts] = useState([]);
  const API_URL = process.env.REACT_NATIVE_API_URL;
  const [isLoading, setIsLoading] = useState(false);
 


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get("/api/getProducts");
      if(response.data.length < 1){
        setIsLoading(true);
      }else{
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

  if(isLoading){
    return <Loader/>
  }

  return (
    <View style={[styles.container]}>
      <Text style={[styles.title,{marginTop:20,marginBottom:20}]}>Produktet</Text>
      {products === null || products === undefined || products.length < 1 ? 
        (
          <Text 
            style={{color:'white',textAlign:'center', marginTop:'5%',fontSize:20}}>
              Nuk ka të dhëna!
          </Text>
        ):
        (
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
              style={styles.textContainer}
            >
              <View style={styles.textWrapper}>
                <Text numberOfLines={3} ellipsizeMode="tail" style={[styles.text, {fontSize: calculateFontSize(item.name)}]}>{item.name}</Text>
              </View>
              <Text style={[styles.text, styles.textBold, {fontSize: 14}]}>{item.price}€</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
        )
      }
      
    </View>
  );
}

const styles = StyleSheet.create({
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
    width: (width / 2) - 30,
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