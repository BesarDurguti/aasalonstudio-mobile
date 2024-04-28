import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../Utils/Colors";
import LogoGold from "../../../assets/Images/Logo/logo2Gold.png";
import axiosClient from "../../axios";

const SendCode = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isSendingRequest, setIsSendingRequest] = useState(false);

  const navigation = useNavigation();

  // Function to navigate to the Register screen
  const navigateBack = () => {
    navigation.goBack();
  };

  const sendCode = async () => {
    setIsSendingRequest(true);
    if (!phoneNumber) {
      setError("Ju lutem vendoseni numrin.");
      setIsSendingRequest(false);
      return;
    }

    try {
      setIsSendingRequest(true);
      const userData = {
        phone_number: phoneNumber,
      };

      const response = await axiosClient.post("/api/sendCode", userData);

      if (response.data.success) {
        navigation.navigate("ResetPassword", { phoneNumber: phoneNumber });
        setError("");
        setIsSendingRequest(false);
      } else {
        setIsSendingRequest(false);
        // Handle login failure
        setError("Sending code failed!");
      }
    } catch (err) {
      setIsSendingRequest(false);
      setError(err.response.data.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: Colors.BLACK,
        justifyContent: "center",
        alignItems: "center",
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={textStyles.containers}
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: Colors.BLACK }}
      >
        <Image source={LogoGold} style={textStyles.image} />
        <Text style={textStyles.headerTitle}>Verifikoni numrin</Text>
        <View style={textStyles.view}>
          <Text
            style={{
              fontFamily: "outfit-md",
              color: Colors.GOLD,
              marginBottom: 4,
              fontSize: 14,
            }}
          >
            Numri
          </Text>
          <TextInput
            style={textStyles.inputsDefault}
            onChangeText={(text) => setPhoneNumber(text)}
            keyboardType="phone-pad"
            placeholder="+3834XXXXXXX"
            placeholderTextColor={Colors.GOLD}
          />

          {error ? (
            <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
          ) : null}

          <View
            style={{
              marginTop: 20,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity onPress={navigateBack}>
              <Text
                style={{
                  fontFamily: "outfit-md",
                  color: Colors.GOLD,
                  marginBottom: 4,
                  fontSize: 14,
                }}
              >
                Kthehu
              </Text>
            </TouchableOpacity>
          </View>

          {!isSendingRequest ? (
            <TouchableOpacity style={textStyles.buttons} onPress={sendCode}>
              <Text
                style={{
                  color: Colors.BLACK,
                  textAlign: "center",
                  fontFamily: "outfit-md",
                  fontSize: 16,
                }}
              >
                Dërgo Kodin
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={textStyles.buttons}>
              <Text
                style={{
                  color: Colors.BLACK,
                  textAlign: "center",
                  fontFamily: "outfit-md",
                  fontSize: 16,
                }}
              >
                <ActivityIndicator size="small" color={Colors.BLACK} />
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const textStyles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
  },
  containers: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.BLACK,
    paddingBottom: 50, // Additional padding to ensure button visibility
  },
  view: {
    marginTop: 15,
    display: "flex",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "outfit-md",
    color: Colors.GOLD,
    textAlign: "center",
    marginTop: 30,
  },
  inputsDefault: {
    width: 300,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: Colors.GOLD,
    borderRadius: 10,
    color: Colors.GOLD,
  },
  buttons: {
    padding: 10,
    textAlign: "center",
    paddingHorizontal: 50,
    marginTop: 20,
    backgroundColor: Colors.GOLD,
    borderRadius: 13,
  },
});

export default SendCode;
