import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import React, { useContext } from "react";
import Colors from "../../Utils/Colors";
import { Feather } from "@expo/vector-icons";
import { UserContext } from "../../store/UserContext";

const window = Dimensions.get("window");

export default function MainSection() {
  const { user } = useContext(UserContext);
  // console.log(user.name, "we are on user 2");

  return (
    <View style={[user.gender === 'male' ? styles.mainSection : styles.mainSectionFemale]}>
      <Text style={[user.gender === 'male' ? styles.text : styles.textFemale]}>Profile</Text>
      <View style={[user.gender === 'male' ? styles.borderBottom : styles.borderBottomFemale]}></View>
      <View style={styles.profili}>
        <View style={[user.gender === 'male' ? styles.userDiv : styles.userDivFemale]}>
          <Text style={[user.gender === 'male' ? styles.userText : styles.userTextFemale]}>{user.name[0]}{user.username[0]}</Text>
        </View>
        <Text style={[user.gender === 'male' ? styles.userInfo : styles.userInfoFemale]}>
          {user.name} {user.username}
        </Text>
        <Text style={[user.gender === 'male' ? styles.userInfoG : styles.userInfoGFemale]}>
          <Feather name="smartphone" size={18} color={user.gender === 'male' ? Colors.WHITE : Colors.GOLD} /> {user.phone}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontFamily: "outfit-md",
    paddingBottom: 10,
  },
  borderBottom: {
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },
  mainSection: {
    height: window.height * 0.35,
    backgroundColor: "black",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  profili: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  userDiv: {
    backgroundColor: Colors.WHITE,
    width: "30%",
    height: "40%",
    borderRadius: window.height * 0.2, // Numeric value for borderRadius
    justifyContent: "center",
    alignItems: "center",
  },

  userText: {
    fontSize: 48,
    color: "black",
    fontFamily: "outfit-md",
  },
  userInfo: {
    fontFamily: "outfit-md",
    fontSize: 24,
    marginTop: 15,
    color: Colors.WHITE,
  },
  userInfoG: {
    fontFamily: "outfit-r",
    fontSize: 16,
    marginTop: 5,
    color: Colors.WHITE,
    alignItems: "center",
  },
  textFemale: {
    color: Colors.GOLD,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "outfit-md",
    paddingBottom: 10,
  },
  borderBottomFemale: {
    borderBottomColor: Colors.GOLD,
    borderBottomWidth: 1,
  },
  userDivFemale: {
    backgroundColor: Colors.GOLD,
    width: "30%",
    height: "40%",
    borderRadius: window.height * 0.2, // Numeric value for borderRadius
    justifyContent: "center",
    alignItems: "center",
  },
  userInfoFemale: {
    fontFamily: "outfit-md",
    fontSize: 24,
    marginTop: 15,
    color: Colors.GOLD,
  },
  userInfoGFemale: {
    fontFamily: "outfit-r",
    fontSize: 16,
    marginTop: 5,
    color: Colors.GOLD,
    alignItems: "center",
  },
  mainSectionFemale: {
    height: window.height * 0.35,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  userTextFemale: {
    fontSize: 48,
    color: Colors.WHITE,
    fontFamily: "outfit-md",
  },
});
