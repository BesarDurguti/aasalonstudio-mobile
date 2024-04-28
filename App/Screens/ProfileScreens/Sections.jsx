import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useContext, useState } from "react";
import Colors from "../../Utils/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import axiosClient from "../../axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../../store/UserContext";
import { useNavigation } from "@react-navigation/native";

export default function Sections() {
  const navigation = useNavigation();
  const [isPressedButton, setPressedButton] = useState(null);
  const { setIsLogged, user } = useContext(UserContext);
  const handlePressIn = (index) => {
    setPressedButton(index);
  };

  const handlePressOut = () => {
    setPressedButton(null);
  };

  const isPressed = (index) => {
    return isPressedButton === index;
  };

  const logout = async () => {
    try {
      const response = await axiosClient.post("/api/logout");

      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      setIsLogged(false);
    } catch (err) {
      console.log(err.response.error, err);
    }
  };

  const handleNavigate = (name) => {
    navigation.navigate(name);
  };

  return (
    <View style={{ marginTop: 40 }}>
      <TouchableOpacity
        style={[style.divSection, isPressed(0) && style.divSectionPressed]}
        onPressIn={() => handlePressIn(0)}
        onPressOut={() => handlePressOut(0)}
        onPress={() => handleNavigate("ChangePassword")}
      >
        <Text style={[user.gender === 'male' ? style.settingsText : style.settingsTextFemale]}>Nderroni passwordin</Text>
        <MaterialIcons
          style={style.iconStyle}
          name="arrow-forward-ios"
          size={20}
          color={user.gender === 'male' ? Colors.WHITE : Colors.GOLD}
        />
      </TouchableOpacity>

      {user.role === "admin" || user.role === "super" ? (
        <TouchableOpacity
          style={[style.divSection, isPressed(2) && style.divSectionPressed]}
          onPressIn={() => handlePressIn(2)}
          onPressOut={() => handlePressOut(2)}
          onPress={() => handleNavigate("AppointmentsAdmin")}
        >
        <Text style={[user.gender === 'male' ? style.settingsText : style.settingsTextFemale]}>Terminet e berberit</Text>
        <MaterialIcons
          style={style.iconStyle}
          name="arrow-forward-ios"
          size={20}
          color={user.gender === 'male' ? Colors.WHITE : Colors.GOLD}
        />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[style.divSection, isPressed(1) && style.divSectionPressed]}
          onPressIn={() => handlePressIn(1)}
          onPressOut={() => handlePressOut(1)}
          onPress={() => handleNavigate("AppointmentsUser")}
        >
          <Text style={[user.gender === 'male' ? style.settingsText : style.settingsTextFemale]}>Terminet</Text>
          <MaterialIcons
            style={style.iconStyle}
            name="arrow-forward-ios"
            size={20}
            color={user.gender === 'male' ? Colors.WHITE : Colors.GOLD}
          />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[style.divSection, isPressed(3) && style.divSectionPressed]}
        onPressIn={() => handlePressIn(3)}
        onPressOut={() => handlePressOut(3)}
        onPress={() => handleNavigate("ChatUsers")}
      >
        <Text style={[user.gender === 'male' ? style.settingsText : style.settingsTextFemale]}>Bisedat</Text>
        <MaterialIcons
          style={style.iconStyle}
          name="arrow-forward-ios"
          size={20}
          color={user.gender === 'male' ? Colors.WHITE : Colors.GOLD}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={logout}>
        <Text
          style={{
            color: "white",
            textAlign: "center",
            marginTop: 20,
            fontSize: 20,
            color: user.gender === 'male' ? Colors.WHITE : Colors.GOLD,
            fontFamily: "outfit-b",
          }}
        >
          Sign out
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const style = StyleSheet.create({
  settingsText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: "outfit-r",
    paddingHorizontal: 20,
  },
  iconStyle: {
    paddingHorizontal: 20,
  },
  divSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  divSectionPressed: {
    backgroundColor: Colors.GRAY,
    color: "black",
  },
  settingsTextFemale: {
    color: Colors.GOLD,
    fontSize: 16,
    fontFamily: "outfit-r",
    paddingHorizontal: 20,
  },
});
