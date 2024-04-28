import React, { useEffect, useState, useCallback } from "react";
import { Linking, Platform } from "react-native";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";
import Loader from "../Loader/Loader";

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [destination, setDestination] = useState({ latitude: 0, longitude: 0 });

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  useEffect(() => {
    if (!isFocused) return;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      // Set the destination coordinates here
      setDestination({ latitude: 42.3961576, longitude: 20.5670104 });

      const googleMapsUrl = `comgooglemaps://?daddr=${destination.latitude},${destination.longitude}`;
      const webUrl = `http://maps.google.com/maps?daddr=${destination.latitude},${destination.longitude}`;

      const canOpenGoogleMaps = await Linking.canOpenURL(googleMapsUrl);

      if (canOpenGoogleMaps) {
        Linking.openURL(googleMapsUrl);
      } else {
        Linking.openURL(webUrl);
      }
    })();
  }, [isFocused]);

  return <Loader />;
};

export default MapScreen;