import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { React, useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../../store/UserContext";
import Colors from "../../Utils/Colors";
import axiosClient from "../../axios";

export default function DeleteAccount() {
  const { user, logoutForDeleteAccount } = useContext(UserContext);
  const navigation = useNavigation();

  const navigateBack = () => {
    navigation.goBack();
  };

  async function deleteAccount() {
    try {
      const response = await axiosClient.post("/api/deleteAccount");
      if (response.status === 200) {
        logoutForDeleteAccount();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View
      style={[
        styles.container1,
        user.gender === "male"
          ? { backgroundColor: Colors.BLACK }
          : { backgroundColor: Colors.WHITE },
      ]}
    >
      <View
        style={[user.gender === "male" ? styles.header : styles.headerFemale]}
      >
        <TouchableOpacity
          onPress={() => navigateBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={[styles.headerText]}>Fshi llogarinë</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={{ color: "white", fontSize: 18 }}>
          A jeni i sigurt që dëshironi të fshini llogarinë tuaj?
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => deleteAccount()}
            style={{
              backgroundColor: "white",
              paddingVertical: 5,
              paddingHorizontal: 40,
              borderRadius: 10,
            }}
          >
            <Text>Po</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigateBack()}
            style={{
              backgroundColor: "white",
              paddingVertical: 5,
              paddingHorizontal: 40,
              borderRadius: 10,
            }}
          >
            <Text>Jo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  container1: {
    flex: 1,
    backgroundColor: Colors.BLACK,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  email: {
    color: "blue",
    textDecorationLine: "underline",
  },
  thankYou: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },
  headerFemale: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.GOLD,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GOLD,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
