import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { UserContext } from "../../store/UserContext";
import { useNavigation } from "@react-navigation/native";

export default function Workers() {
  const { barbers, setSelectedBarber } = useContext(UserContext);
  const API_URL = process.env.REACT_NATIVE_API_URL;
  const navigation = useNavigation();

  const handleBarberClick = async (id) => {
    const selectedBarberFromHome = barbers.find((barber) => barber.id === id);
    await setSelectedBarber(selectedBarberFromHome);
    navigation.navigate("TabNavigation", { screen: "booking" });
  };

  return (
    <View style={{ marginTop: 30 }}>
      <Text
        style={{
          color: "white",
          textAlign: "center",
          fontSize: 26,
          fontFamily: "outfit-md",
        }}
      >
        Zgjidhni një Specialist
      </Text>
      <FlatList
        data={barbers}
        horizontal={true}
        style={{ marginTop: 20 }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleBarberClick(item.id)}>
            <View style={{ marginRight: 30 }}>
              <Image
                source={{ uri: API_URL + item.avatar }}
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 100,
                }}
              />
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontFamily: "outfit-r",
                  marginTop: 10,
                }}
              >
                {item.name}
                {"\n"}({item.phone})
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
