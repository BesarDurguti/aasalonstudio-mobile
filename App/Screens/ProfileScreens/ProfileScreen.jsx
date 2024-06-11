import { ScrollView } from "react-native";
import React, {useContext} from "react";
import MainSection from "./MainSection";
import Colors from "../../Utils/Colors";
import Sections from "./Sections";
import { UserContext } from "../../store/UserContext";

export default function ProfileScreen() {
  const {user} = useContext(UserContext);
  return (
    <ScrollView style={{ backgroundColor: user.gender === 'male' ? Colors.BLACK : Colors.WHITE }}>
      <MainSection />
      <Sections />
    </ScrollView>
  );
}
