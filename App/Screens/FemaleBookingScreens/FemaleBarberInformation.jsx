import React, { useContext, useEffect } from "react";
import { View, Text, Image } from "react-native";
import Colors from "../../Utils/Colors";
import { UserContext } from "../../store/UserContext";

const FemaleBarberInformation = () => {
  const { selectedBarber: barber } = useContext(UserContext);
  const API_URL = process.env.REACT_NATIVE_API_URL;
  
  return (
    <View style={{ alignItems: "center" }}>
      <Image
        source={{ uri: API_URL + barber.avatar }}
        style={{ width: 150, height: 150, borderRadius: 100 }}
      />
      <Text
        style={{
          fontSize: 20,
          fontFamily: "outfit-md",
          marginVertical: 10,
          color: Colors.GOLD,
        }}
      >
        {barber.name} {barber.username}
      </Text>
    </View>
  );
};

export default FemaleBarberInformation;
