import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from "react-native";
import React from "react";
import femaleImg from "../../../assets/Images/Photos/femaleImg.png";
// import MainSectionImg from "../../../assets/Images/Photos/headerPhoto.jpg";
import { useNavigation } from "@react-navigation/native";

import Colors from "../../Utils/Colors";

const { width } = Dimensions.get("window");
const isTablet = width >= 600;

export default function FemaleMainSection() {
  const navigation = useNavigation();

  const navigateToBooking = () => {
    navigation.navigate("TabNavigation", { screen: "booking" });
  }


  return (
    <View style={style.View}>
      <Image
        source={femaleImg}
        style={{
          width: "100%",
          height: isTablet ? 400 : 250,
          borderWidth: 0.1,
          borderColor: "white",
          borderRadius: 10,
          position: "relative", // Added this line
        }}
      />
      {/* <Text style={style.text}>Behu e bukur sot</Text> */}
      {/* <TouchableOpacity style={style.book} onPress={navigateToBooking}> */}
        {/* <Text style={{ color: Colors.GOLD, fontFamily: "outfit-md" }}> */}
          {/* <Text style={{ color: Colors.GOLD, fontFamily: "outfit-md" }}> */}
          {/* Cakto termin */}
        {/* </Text> */}
      {/* </TouchableOpacity> */}
    </View>
  );
}

const style = StyleSheet.create({
  View: {
    marginTop: 20,
    display: "flex",
    alignItems: "center",
  },
  text: {
    position: "absolute",
    top: "30%", // Adjust this value as needed
    right: "10%",
    fontSize: 22,
    color: "white",
    fontFamily: "outfit-b",
  },
  book: {
    position: "absolute",
    bottom: 20, // Adjust this value as needed
    right: 40,
    backgroundColor: Colors.BLACK,
    borderWidth: 1,
    borderColor: Colors.GOLD,
    // borderColor: Colors.GOLD,
    paddingHorizontal: 40,
    paddingVertical: 13,
    borderRadius: 10,
  },
});
