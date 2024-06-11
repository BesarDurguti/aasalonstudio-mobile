import { View, Text, Image, FlatList, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import womanWorkers from "../../../assets/Images/Photos/womanWorkers.jpeg";
import React, { useContext } from "react";
import { UserContext } from "../../store/UserContext";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../Utils/Colors";

const { width } = Dimensions.get("window");
const isTablet = width >= 600;

export default function FemaleWorkers() {
  const { barbers, setSelectedBarber } = useContext(UserContext);
  const API_URL = process.env.REACT_NATIVE_API_URL;
  const navigation = useNavigation();

  const handleBarberClick = async (id) => {
    const selectedBarberFromHome = barbers.find((barber) => barber.id === id);
    await setSelectedBarber(selectedBarberFromHome);
    navigation.navigate("TabNavigation", { screen: "booking" });
  };

  return (
    <View style={{ flex: 1, marginTop: 30 }}>
      <Text
        style={{
          color: "black",
          textAlign: "center",
          fontSize: 26,
          fontFamily: "outfit-m",
        }}
      >
        Zgjidhni një Specialiste
      </Text>
      {barbers === null || barbers === undefined || barbers.length < 1 ? 
      (
            <Text 
            style={{color:'black',textAlign:'center', marginTop:'5%',fontSize:20}}>
              Nuk ka të dhëna!
            </Text>
        
      ) :
      (
            <ScrollView style={{ marginTop: 20 }}>
        {barbers.map((item, index) => (
          <TouchableOpacity key={item.id} onPress={() => handleBarberClick(item.id)}>
            <View
              style={{
                marginBottom: 20,
                shadowColor: Colors.GOLD,
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: Colors.WHITE,
                  padding: 10,
                  borderRadius: 6,
                }}
              >
                <Image
                  source={{ uri: API_URL + item.avatar }}
                  style={{
                    height: isTablet ? 180 : 120,
                    width: isTablet ? 180 : 120,
                    borderRadius: 6,
                    marginRight: 20,
                  }}
                />
                <View>
                  <Text
                    style={{
                      color: Colors.GOLD,
                      fontFamily: 'outfit-r',
                      fontSize: 20,
                    }}
                  >
                    {item.name}
                    {'\n'}({item.phone})
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
         ) 
        }
    </View>
  );
}
