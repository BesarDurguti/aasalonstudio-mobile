import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../Utils/Colors";
import LogoGold from "../../../assets/Images/Logo/logo2Gold.png";
import axiosClient from "../../axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../../store/UserContext";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const navigation = useNavigation();
  const { updateUserLoggedInStatus } = useContext(UserContext);

  // Function to navigate to the Register screen
  const navigateToRegister = () => {
    setPhone("");
    navigation.navigate("Register");
  };
  //Function to navigate to verify account screen
  const navigateToSendCode = () => {
    setPhone("");
    navigation.navigate("SendCode");
  };
  //Function to navigate to Home Screen
  const navigateLogin = () => {
    setPhone("");
    navigation.navigate("TabNavigation", { screen: "HomeScreen" });
  };

  const login = async () => {
    if (!phone || !password) {
      setError("Vendosni ju lutem numrin dhe fjalëkalimin.");
      return;
    }

    try {
      const userData = {
        phone,
        password,
      };

      setIsSendingRequest(true);

      const response = await axiosClient.post("/api/login", userData);
      console.log(response.data);
      if (response.data.success) {
        const token = response.data.token;
        const user = response.data.user;

        // Save the token in AsyncStorage
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));

        updateUserLoggedInStatus(true, user, token);
        setError("");
        navigateLogin();
      }
    } catch (err) {
      setIsSendingRequest(false);
      if (err.response.data.status === "unverified") {
        navigation.navigate("VerifyCode", { phoneNumber: phone });
      } else {
        setError(err.response.data.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.BLACK,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={textStyles.containers}
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: Colors.BLACK }}
      >
        <Image source={LogoGold} style={textStyles.image} />
        <Text style={textStyles.headerTitle}>Kyqu</Text>
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
            onChangeText={(text) => setPhone(text)}
            keyboardType="phone-pad"
            placeholder="+3834XXXXXXX"
            placeholderTextColor={Colors.GOLD}
            onSubmitEditing={Keyboard.dismiss}
          />
          <Text
            style={{
              fontFamily: "outfit-md",
              color: Colors.GOLD,
              marginBottom: 4,
              fontSize: 14,
            }}
          >
            Fjalëkalimi
          </Text>
          <TextInput
            style={textStyles.inputsDefault}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            onSubmitEditing={Keyboard.dismiss}
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
            <Text
              style={{
                fontFamily: "outfit-md",
                color: Colors.GOLD,
                marginBottom: 4,
                fontSize: 14,
              }}
            >
              Nuk keni llogari?
            </Text>

            <TouchableOpacity onPress={navigateToRegister}>
              <Text
                style={{
                  fontFamily: "outfit-md",
                  color: Colors.GOLD,
                  marginBottom: 4,
                  fontSize: 14,
                }}
              >
                Regjistrohu
              </Text>
            </TouchableOpacity>
          </View>

          {!isSendingRequest ? (
            <TouchableOpacity style={textStyles.buttons} onPress={login}>
              <Text
                style={{
                  color: Colors.BLACK,
                  textAlign: "center",
                  fontFamily: "outfit-md",
                  fontSize: 16,
                }}
              >
                Kyqu
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
          <TouchableOpacity onPress={navigateToSendCode}>
            <Text
              style={{
                color: Colors.GOLD,
                textAlign: "center",
                fontFamily: "outfit-md",
                fontSize: 16,
                marginTop: 30,
              }}
            >
              Keni harruar fjalëkalimin?
            </Text>
          </TouchableOpacity>
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

export default Login;
