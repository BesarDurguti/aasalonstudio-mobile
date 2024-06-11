import React from "react";
import { SafeAreaView, View, StyleSheet, StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { UserProvider } from "./App/store/UserContext";
import AppNavigator from "./App/router/routes";
import { ChatAppointmentProvider } from "./App/store/ChatAppointment";

export default function App() {
  const [fontsLoaded] = useFonts({
    "outfit-b": require("./assets/Fonts/Outfit-Bold.ttf"),
    "outfit-md": require("./assets/Fonts/Outfit-Medium.ttf"),
    "outfit-r": require("./assets/Fonts/Outfit-Regular.ttf"),
  });

  return (
    <UserProvider>
      <ChatAppointmentProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar backgroundColor="black" barStyle="light-content" />
          <View style={styles.content}>
            <AppNavigator />
          </View>
        </SafeAreaView>
      </ChatAppointmentProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  content: {
    flex: 1,
  },
});
