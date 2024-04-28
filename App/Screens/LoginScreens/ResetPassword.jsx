import React, { useContext, useState, useEffect } from "react";
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
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Colors from "../../Utils/Colors";
import LogoGold from "../../../assets/Images/Logo/logo2Gold.png";
import axiosClient from "../../axios";

const ResetPassword = () => {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isSendingRequest, setIsSendingRequest] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();

  const navigateBackToLogin = () => {
    navigation.navigate("Login");
  };

  useEffect(() => {
    if (route.params && route.params.phoneNumber) {
      setPhoneNumber(route.params.phoneNumber);
    }
  }, [route.params]);

  const resetPassword = async () => {
    setIsSendingRequest(true);
    if (!code || !newPassword) {
      setIsSendingRequest(false);
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsSendingRequest(true);
      const userData = {
        phone_number: phoneNumber,
        verification_code: code,
        new_password: newPassword,
      };

      const response = await axiosClient.post("/api/resetPassword", userData);
      console.log("test: ", response.data);
      if (response.data.success) {
        Alert.alert("Success", response.data.message);
        navigateBackToLogin();
        setError("");
      }
      setIsSendingRequest(false);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors.new_password);
      } else {
        setError(err.response.data.message);
      }
      setIsSendingRequest(false);
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
        <Text style={textStyles.headerTitle}>Ndrysho fjalëkalimin</Text>
        <View style={textStyles.view}>
          <Text
            style={{
              fontFamily: "outfit-md",
              color: Colors.GOLD,
              marginBottom: 4,
              fontSize: 14,
            }}
          >
            Kodi verifikimit
          </Text>
          <TextInput
            style={textStyles.inputsDefault}
            onChangeText={(text) => setCode(text)}
            keyboardType="phone-pad"
            placeholder="XXXXXX"
            placeholderTextColor={Colors.GOLD}
          />
          <Text
            style={{
              fontFamily: "outfit-md",
              color: Colors.GOLD,
              marginBottom: 4,
              fontSize: 14,
            }}
          >
            Fjalëkalimi i ri
          </Text>
          <TextInput
            style={textStyles.inputsDefault}
            secureTextEntry={true}
            onChangeText={(text) => setNewPassword(text)}
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
          ></View>

          {!isSendingRequest ? (
            <TouchableOpacity
              style={textStyles.buttons}
              onPress={resetPassword}
            >
              <Text
                style={{
                  color: Colors.BLACK,
                  textAlign: "center",
                  fontFamily: "outfit-md",
                  fontSize: 16,
                }}
              >
                Reset Password
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

export default ResetPassword;
