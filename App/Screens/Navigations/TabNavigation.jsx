import React, { Component } from "react";
import { Text, View, Dimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import HomeScreen from "../HomeScreens/HomeScreen";
import ProfileScreen from "../ProfileScreens/ProfileScreen";
import MapScreen from "../MapScreens/MapScreen";
import ProductScreen from "../ProductScreens/ProductScreen";
import FemaleProductScreen from "../FemaleProductScreens/FemaleProductScreen";
import BookingScreen from "../BookingScreens/BookingScreen";
import FemaleBookingScreen from "../FemaleBookingScreens/FemaleBookingScreen";
import { Feather } from "@expo/vector-icons";
import Colors from "../../Utils/Colors";
import { UserContext } from "../../store/UserContext";

const Tab = createBottomTabNavigator();

const { width } = Dimensions.get("window");
const isTablet = width >= 600;

// const section = 'female';

// const BookingComponent = section === 'female' ? FemaleBookingScreen : BookingScreen;
// const ProductComponent = section === 'female' ? FemaleProductScreen : ProductScreen;

export default class TabNavigation extends Component {
  static contextType = UserContext;

  render() {
    const { user } = this.context;
    const section = user?.gender === "female" ? "female" : "male";
    const BookingComponent =
      section === "female" ? FemaleBookingScreen : BookingScreen;
    const ProductComponent =
      section === "female" ? FemaleProductScreen : ProductScreen;

    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.GOLD,
          tabBarStyle: { backgroundColor: Colors.BLACK },
        }}
      >
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            tabBarLabel: ({ color }) => (
              <Text style={isTablet ? {color: color, fontSize: 12, padding:15 }:{ color: color, fontSize: 12, marginTop: -7 }}>
                Ballina
              </Text>
            ),
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="booking"
          component={BookingComponent}
          options={{
            tabBarLabel: ({ color }) => (
              <Text style={isTablet ? {color: color, fontSize: 12, padding:15 }:{ color: color, fontSize: 12, marginTop: -7 }}>
                Terminet
              </Text>
            ),
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="book" size={size} color={color} />
            ),
          }}
        />
{/* 
        <Tab.Screen
          name="MapScreen"
          component={MapScreen}
          options={{
            tabBarLabel: ({ color }) => (
              <Text style={{ color: color, fontSize: 12, marginTop: -7 }}>
                Lokacioni
              </Text>
            ),
            tabBarIcon: ({ color, size }) => (
              <Feather name="map" size={size} color={color} />
            ),
          }}
        /> */}
        <Tab.Screen
          name="products"
          component={ProductComponent}
          options={{
            tabBarLabel: ({ color }) => (
              <Text style={isTablet ? {color: color, fontSize: 12, padding:15 }:{ color: color, fontSize: 12, marginTop: -7 }}>
                Produktet
              </Text>
            ),
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="laptop" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: ({ color }) => (
              <Text style={isTablet ? {color: color, fontSize: 12, padding:15 }:{ color: color, fontSize: 12, marginTop: -7 }}>
                Profili
              </Text>
            ),
            tabBarIcon: ({ color, size }) => (
              <Feather name="user" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}
