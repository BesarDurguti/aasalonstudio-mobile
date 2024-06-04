import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Colors from "../../Utils/Colors";
import LogoGold from "../../../assets/Images/Logo/logo2Gold.png";
import axiosClient from "../../axios";
import { useNavigation, useRoute } from "@react-navigation/native";

const VerifyCode = () => {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [error, setError] = useState("");

  const route = useRoute();

  const navigation = useNavigation();

  useEffect(() => {
    // Get phone number from route params
    const { phoneNumber } = route.params;

    if (phoneNumber) {
      setPhone(phoneNumber);
    }
  }, []);

  const verifyAcc = async () => {
    setIsSendingRequest(true);
    if (!phone || !code) {
      setError("Ju lutemi plotesoni fushat!");
      setIsSendingRequest(false);
      return;
    }
    try {
      const userData = {
        phone,
        verification_code: code,
      };

      const response = await axiosClient.post("/api/verify", userData);
      // console.log(response.data);
      if (response.data.success) {
        navigation.navigate("Login");
      } else {
        setIsSendingRequest(false);
        setError("Ju lutemi vendoseni kodin e duhur");
      }
    } catch (err) {
      setIsSendingRequest(false);
      if (err.response) {
        // You can log specific details, such as validation errors
        if (err.response.data.errors) {
          setError("Kodi mund te permbaj vetem numra!");
        }
      }
    }
  };

  const navigateToLogin = () => {
    setPhone("");
    navigation.navigate("Login");
  };
  const navigateToRegister = () => {
    setPhone("");
    navigation.navigate("Register");
  };

  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        backgroundColor: Colors.BLACK,
      }}
    >
      <Image source={LogoGold} style={textStyles.image} />
      <Text style={textStyles.headerTitle}>Verifikoni llogarinë</Text>
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
          value={phone}
          editable={false}
        />

        <Text
          style={{
            fontFamily: "outfit-md",
            color: Colors.GOLD,
            marginBottom: 4,
            fontSize: 14,
          }}
        >
          Kodi
        </Text>
        <TextInput
          style={textStyles.inputsDefault}
          value={code}
          onChangeText={(text) => setCode(text)}
        />

        {error ? (
          <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
        ) : null}

        {!isSendingRequest ? (
          <TouchableOpacity style={textStyles.buttons} onPress={verifyAcc}>
            <Text
              style={{
                color: Colors.BLACK,
                textAlign: "center",
                fontFamily: "outfit-md",
                fontSize: 16,
              }}
            >
              Verifikohu
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
                justifyContent:'center',
                alignSelf:'center'
              }}
            >
              <ActivityIndicator size="small" color={Colors.BLACK} />
            </Text>
          </TouchableOpacity>
        )}

        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={navigateToLogin}>
            <Text
              style={{
                fontFamily: "outfit-md",
                color: Colors.GOLD,
                marginBottom: 10,
                fontSize: 14,
              }}
            >
              Kyqu
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={navigateToRegister}>
            <Text
              style={{
                fontFamily: "outfit-md",
                color: Colors.GOLD,
                marginBottom: 10,
                fontSize: 14,
              }}
            >
              Regjistrohu
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const textStyles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
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

export default VerifyCode;
