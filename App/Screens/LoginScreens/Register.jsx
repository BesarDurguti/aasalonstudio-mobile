import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import Colors from "../../Utils/Colors";
import LogoGold from "../../../assets/Images/Logo/logo2Gold.png";
import axiosClient from "../../axios";

const Register = () => {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [open, setOpen] = useState(false);
  const [gender, setGender] = useState(null);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [items, setItems] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ]);

  const [error, setError] = useState("");

  const navigateToLogin = () => {
    navigation.navigate("Login");
  };

  const validateInputs = () => {
    if (
      !name.trim() ||
      !username.trim() ||
      !password.trim() ||
      !phone.trim() ||
      !gender
    ) {
      setError("Ju lutemi, mbushini te gjitha fushat!");
      return false;
    }

    // Additional validation logic can be added here

    return true;
  };

  const register = async () => {
    setIsSendingRequest(true);
    if (!validateInputs()) {
      setIsSendingRequest(false);
      return;
    }

    try {
      setIsSendingRequest(true);
      const userData = {
        name,
        username,
        password,
        phone,
        gender,
      };
      // Make a POST request to the registration endpoint
      const response = await axiosClient.post("/api/register", userData);
      // console.log(response.data);
      // console.log(response);
      if (response.data.success) {
        navigation.navigate("VerifyCode", { phoneNumber: phone });
      }
      setIsSendingRequest(false);
      // Optionally, you might want to navigate to a different screen or perform other actions
    } catch (err) {
      setIsSendingRequest(false);
      if (err.response.data.errors) {
        const errors = err.response.data.errors;
        const errorMessages = Object.values(errors).flat().join("\n");
        setError(errorMessages);
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
      <View
        contentContainerStyle={styles.containers}
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: Colors.BLACK }}
      >
        <View style={styles.inner}>
          <Image source={LogoGold} style={styles.image} />
          <Text style={styles.headerTitle}>Krijo Llogari</Text>
          <View style={styles.view}>
            <Text style={styles.label}>Emri</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(text) => setName(text)}
              onSubmitEditing={Keyboard.dismiss}
            />
            <Text style={styles.label}>Mbiemri</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={(text) => setUsername(text)}
              onSubmitEditing={Keyboard.dismiss}
            />
            <Text style={styles.label}>Numri</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={(text) => setPhone(text)}
              keyboardType="phone-pad"
              placeholder="+3834XXXXXXX"
              placeholderTextColor={Colors.GOLD}
              onSubmitEditing={Keyboard.dismiss}
            />
            <Text style={styles.label}>Gjinia</Text>
            <DropDownPicker
              open={open}
              textStyle={styles.label}
              style={[styles.input, { backgroundColor: "black" }]}
              value={gender}
              items={items}
              setOpen={setOpen}
              setValue={setGender}
              setItems={setItems}
              zIndex={1000}
              placeholder="Choose Gender"
              dropDownContainerStyle={[
                styles.input,
                { backgroundColor: "black" },
              ]}
            />
            <Text style={styles.label}>Fjalëkalimi</Text>
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              value={password}
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
                A keni llogari?
              </Text>

              <TouchableOpacity onPress={navigateToLogin}>
                <Text
                  style={{
                    fontFamily: "outfit-md",
                    color: Colors.GOLD,
                    marginBottom: 4,
                    fontSize: 14,
                  }}
                >
                  Kyqu
                </Text>
              </TouchableOpacity>
            </View>

            {!isSendingRequest ? (
              <TouchableOpacity style={styles.button} onPress={register}>
                <Text style={styles.buttonText}>Regjistrohu</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button}>
                <ActivityIndicator size="small" color={Colors.BLACK} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containers: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.BLACK,
    paddingBottom: 50, // Additional padding to ensure button visibility
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.BLACK,
    width: "100%",
  },
  image: {
    width: 80,
    height: 80,
    alignSelf: "center",
  },
  view: {
    marginTop: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "sans-serif",
    textAlign: "center",
    marginTop: 30,
    color: Colors.GOLD,
  },
  label: {
    fontFamily: "outfit-md",
    color: Colors.GOLD,
    marginBottom: 4,
    fontSize: 12,
  },
  input: {
    width: 300,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: Colors.GOLD,
    borderRadius: 10,
    color: Colors.GOLD,
    fontSize: 12,
  },
  button: {
    padding: 10,
    textAlign: "center",
    paddingHorizontal: 50,
    marginTop: 20,
    backgroundColor: Colors.GOLD,
    borderRadius: 15,
    justifyContent:'center',
    alignSelf:'center'
  },
  buttonText: {
    color: Colors.BLACK,
    fontSize: 16,
    fontFamily: "outfit-md",
    textAlign: "center",
  },
  gender: {
    color: Colors.GOLD,
    backgroundColor: "White",
  },
});

export default Register;
