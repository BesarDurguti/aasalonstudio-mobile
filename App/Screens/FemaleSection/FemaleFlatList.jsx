import React, {useState, useEffect } from "react";
import { View, Text, Image, FlatList } from "react-native";
import axiosClient from "../../axios";

import softGlamMakeup from "../../../assets/Images/Photos/glam2.png";
import hairColorImage from "../../../assets/Images/Photos/hair-color.jpg";
import haircutImage from "../../../assets/Images/Photos/Whaircut.jpg";

export default function FemaleFlatList() {
  const [flatlist, setFlatlist] = useState([]);
  const API_URL = process.env.REACT_NATIVE_API_URL;
  // const data = [
  //   {
  //     id: 1,
  //     name: "Glam Makeup",
  //     image: softGlamMakeup,
  //   },
  //   {
  //     id: 2,
  //     name: "Hair Colouring",
  //     image: hairColorImage,
  //   },
  //   {
  //     id: 3,
  //     name: "Haircut",
  //     image: haircutImage,
  //   },
  // ];

  useEffect(() => {
    fetchFlatlist();
  }, []);

  const fetchFlatlist = async () => {
    try{
      const response = await axiosClient.get('/api/getFlatlist');

      setFlatlist(response.data);
    }catch(error){
      console.error('Error fetching flatlist:', error);
    }
  }

  const enableScroll = flatlist.length > 3;

  const renderItem = ({ item }) => (
    <View style={{ marginRight: 38 }}>
      <Image
        source={{ uri: API_URL + item.image}}
        style={{
          height: 90,
          width: 90,
          borderRadius: 100,
        }}
      />
      <Text
        style={{
          color: "black",
          textAlign: "center",
          fontFamily: "outfit-r",
          marginTop: 10,
          fontSize: 15
        }}
      >
        {item.name}
      </Text>
    </View>
  );

  return (
    <View style={{ marginTop: 10 }}>
      <FlatList
        data={flatlist}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 20 }}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={enableScroll} // Prevent scrolling
      />
    </View>
  );
}