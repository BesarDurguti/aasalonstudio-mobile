import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import React, { useContext } from "react";
import MainSectionImg from "../../../assets/Images/Photos/header1.jpg";
// import MainSectionImg from "../../../assets/Images/Photos/headerPhoto.jpg";

import Colors from "../../Utils/Colors";
import { UserContext } from "../../store/UserContext";

const { width } = Dimensions.get("window");
const isTablet = width >= 600;

export default function MainSection() {
  const { siteInfos } = useContext(UserContext);
  return (
    <View style={style.View}>
      <Image
        source={
          siteInfos[0]
            ? {
                uri: process.env.REACT_NATIVE_API_URL + siteInfos[0].siteBanner,
              }
            : MainSectionImg
        }
        style={{
          width: "100%",
          height: isTablet ? 400 : 250,
          borderWidth: 0.1,
          borderColor: "white",
          borderRadius: 30,
          position: "relative", // Added this line
        }}
      />
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
    borderColor: Colors.WHITE,
    // borderColor: Colors.GOLD,
    paddingHorizontal: 40,
    paddingVertical: 13,
    borderRadius: 10,
  },
});
