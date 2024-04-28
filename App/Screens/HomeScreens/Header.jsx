import { View, Text, Image, StyleSheet, Platform } from "react-native";
import React, { useContext } from "react";
import Logo from "../../../assets/Images/Logo/logo2Gold.png";
import Colors from "../../Utils/Colors";
import { UserContext } from "../../store/UserContext";

export default function Header() {
  const { siteInfos, user } = useContext(UserContext);
  return (
    <View style={[style.View, platformSpecificStyles]}>
      <Text
        style={{
          color: Colors.GOLD,
          fontSize: 15,
          fontFamily: "outfit-medium",
        }}
      >
        {siteInfos[0]?.navbarText ?? "Hi"}, {user.name}!
      </Text>
      <Image source={Logo} style={{ width: 45, height: 45 }} />
    </View>
  );
}

const style = StyleSheet.create({
  View: {
    marginTop: 35,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  button: {
    backgroundColor: Colors.GOLD,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 5,
  },
});

const platformSpecificStyles = Platform.select({
  android: {
    marginTop: 30,
  },
  ios: {
    marginTop: 10,
  },
  default: {
    marginTop: 20, // Default value if platform is not explicitly matched
  },
});
