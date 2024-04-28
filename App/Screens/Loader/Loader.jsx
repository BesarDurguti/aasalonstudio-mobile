import React, { useRef, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Image, Animated, Easing,StatusBar } from "react-native";
import Colors from "../../Utils/Colors";
import Logo from '../../../assets/Images/Logo/logo2Gold.png';

const Loader = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }, [rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      <Animated.Image source={Logo} style={[styles.logo, { transform: [{ rotate: spin }] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.BLACK
  },
  logo: {
    width: 100, // Adjust width and height as needed
    height: 100,
    marginBottom: 20 // Optional margin bottom to separate the logo from the activity indicator
  }
});

export default Loader;
