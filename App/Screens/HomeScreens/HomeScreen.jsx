import { View, ScrollView } from "react-native";
import React, { useContext } from "react";
import Header from "./Header";
import Colors from "../../Utils/Colors";
import MainSection from "./MainSection";
import Services from "./Services";
import Workers from "./Workers";
import FemaleWorkers from "../FemaleSection/FemaleWorkers";
import FemaleHeader from "../FemaleSection/FemaleHeader";
import FemaleMainSection from "../FemaleSection/FemaleMainSection";
import FemaleServices from "../FemaleSection/FemaleServices";
import FemaleFlatList from "../FemaleSection/FemaleFlatList";
import { UserContext } from "../../store/UserContext";

export default function HomeScreen() {
  

  const {user} = useContext(UserContext);

  const section = user.gender;

  const HeaderComponent = section === 'female' ? FemaleHeader : Header;
  const MainComponent = section === 'female' ? FemaleMainSection : MainSection;
  const ServicesComponent = section === 'female' ? FemaleServices  : Services;
  const WorkersComponent = section === 'female' ? FemaleWorkers : Workers;


  const scrollViewStyle = {
    backgroundColor: section === 'female' ? Colors.WHITE : Colors.BLACK, // Adjust colors based on the section
    paddingHorizontal: 10,
  };

  return (
    <ScrollView
      style={scrollViewStyle}
    >
      <HeaderComponent />
      <MainComponent />
      {section === 'female' && <FemaleFlatList />}
      <WorkersComponent />
      <ServicesComponent />
    </ScrollView>
  );
}
