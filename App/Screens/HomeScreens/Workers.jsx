import { View, Text, Image, FlatList, TouchableOpacity, Dimensions } from "react-native";
import React, { useContext } from "react";
import { UserContext } from "../../store/UserContext";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../Utils/Colors";

const { width } = Dimensions.get("window");
const isTablet = width >= 600;

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
    <View style={isTablet ? {marginTop: 30, marginLeft: 45} : { marginTop: 30, }}>
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
      {barbers === null || barbers === undefined || barbers.length < 1 ? 
      (
            <Text 
            style={{color:'white',textAlign:'center', marginTop:'5%',fontSize:20}}>
              Nuk ka të dhëna!
            </Text>
        
      ) :
      (
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
                  height: isTablet ? 150 : 100,
                  width: isTablet ? 150 : 100,
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
      ) 
    }
      
    </View>
  );
}
