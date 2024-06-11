import { View, Image, Text, FlatList, TouchableOpacity, Dimensions } from "react-native";
import React, { useContext } from "react";
import { UserContext } from "../../store/UserContext";
import { useNavigation } from "@react-navigation/native";
import haircutWoman from "../../../assets/Images/Photos/haircutWoman.jpg";
import hairColoring from "../../../assets/Images/Photos/hairColoring.jpg";
import makeup from "../../../assets/Images/Photos/makeup.jpg";

import Colors from "../../Utils/Colors";

const { width } = Dimensions.get("window");
const isTablet = width >= 600;

export default function FemaleServices() {
  const { services, selectedService, setSelectedService, setValue } =
    useContext(UserContext);
  const API_URL = process.env.REACT_NATIVE_API_URL;
  const navigation = useNavigation();

  const handleServiceBook = async (id) => {
    const selectedServiceFromHome = services.find((s) => s.id === id);
    const arrayContainingSelectedService = [selectedServiceFromHome.id];
    await setSelectedService(selectedServiceFromHome);
    await setValue(arrayContainingSelectedService);
    navigation.navigate("TabNavigation", { screen: "booking" });
  };

  return (
    <View style={{ marginTop: 30 }}>
      <Text
        style={{
          color: "black",
          // color: Colors.GOLD,
          fontFamily: "outfit-md",
          fontSize: 26,
          textAlign: "center",
        }}
      >
        Shërbimet
      </Text>
      {services === null || services === undefined || services.length < 1 ? 
        (
          <Text 
            style={{color:'black',textAlign:'center', marginTop:'5%',fontSize:20}}>
              Nuk ka të dhëna!
          </Text>

        ) : (
      <FlatList
        data={services}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View
            style={{
              shadowColor: Colors.GOLD,
              shadowOffset: { width: 1, height: 1 },
              shadowOpacity: 1,
              shadowRadius: 2,
              elevation: 2,
              marginBottom: 20,
              marginLeft: 6,
            }}
          >
            <Image
              source={{ uri: API_URL + item.image }}
              style={{
                aspectRatio: 1.55,
                height: isTablet ? 350 : 220,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                marginTop: 10,
                marginRight: 20,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: Colors.WHITE,
                marginRight: 20,
                padding: 10,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                alignItems: "center",
                borderWidth: 0.4,
                borderColor: Colors.GOLD,
              }}
            >
              <Text
                style={{
                  color: Colors.GOLD,
                  textAlign: "left",
                  fontFamily: "outfit-md",
                }}
              >
                {item.name} - {parseInt(item.price)}&euro;
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.GOLD,
                  padding: 10,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                }}
                onPress={() => handleServiceBook(item.id)}
              >
                <Text style={{ color: Colors.BLACK, fontFamily: "outfit-md" }}>
                  Caktoni termin
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    ) 
  }
    </View>
  );
}

// import { View, Image, Text, FlatList, TouchableOpacity } from "react-native";

// export default function Services() {
//   const { services, selectedService, setSelectedService } =
//     useContext(UserContext);
//   const API_URL = process.env.REACT_NATIVE_API_URL;
//   const navigation = useNavigation();

//   const handleServiceBook = async (id) => {
//     const selectedServiceFromHome = services.find((s) => s.id === id);
//     await setSelectedService(selectedServiceFromHome);
//     navigation.navigate("TabNavigation", { screen: "booking" });
//   };

//   return (
//     <View style={{ marginTop: 30, marginBottom: 20 }}>
//       <Text
//         style={{
//           color: "white",
//           // color: Colors.GOLD,
//           fontFamily: "outfit-md",
//           fontSize: 26,
//           textAlign: "center",
//         }}
//       >
//         Services
//       </Text>
//       <FlatList
//         data={services}
//         horizontal={true}
//         showsHorizontalScrollIndicator={false}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item, index }) => (
//           <View>
//             <Image
//               source={{ uri: API_URL + item.image }}
//               style={{
//                 aspectRatio: 1.55,
//                 height: 220,
//                 borderTopLeftRadius: 15,
//                 borderTopRightRadius: 15,
//                 marginTop: 10,
//                 marginRight: 20,
//               }}
//             />
//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 backgroundColor: "white",
//                 marginRight: 20,
//                 padding: 10,
//                 borderBottomLeftRadius: 10,
//                 borderBottomRightRadius: 10,
//                 alignItems: "center",
//               }}
//             >
//               <Text
//                 style={{
//                   color: "black",
//                   textAlign: "left",
//                   fontFamily: "outfit-md",
//                 }}
//               >
//                 {item.name} - {parseInt(item.price)}&euro;
//               </Text>
//               <TouchableOpacity
//                 style={{
//                   backgroundColor: "black",
//                   padding: 10,
//                   paddingHorizontal: 20,
//                   borderRadius: 5,
//                 }}
//                 onPress={() => handleServiceBook(item.id)}
//               >
//                 <Text style={{ color: "white", fontFamily: "outfit-md" }}>
//                   Book
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   );
// }
