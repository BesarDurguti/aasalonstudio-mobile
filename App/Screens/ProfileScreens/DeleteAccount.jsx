import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { React, useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../../store/UserContext";
import Colors from "../../Utils/Colors";

export default function DeleteAccount() {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();

  const navigateBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container1, user.gender === 'male' ? {backgroundColor: Colors.BLACK} : {backgroundColor: Colors.WHITE}]}>
      <View
        style={[user.gender === "male" ? styles.header : styles.headerFemale]}
      >
        <TouchableOpacity
          onPress={() => navigateBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={[styles.headerText]}>Fshini Accountin</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, user.gender === 'male' ? {color: Colors.WHITE} : {color: Colors.BLACK}]}>A&A Salon Account Deletion</Text>
        <Text style={[styles.paragraph, user.gender === 'male' ? {color: Colors.WHITE} : {color:Colors.BLACK}]}>
          A&A Salon takes user privacy seriously. If you wish to delete your
          account and associated data, please follow these steps:
        </Text>
        <Text style={[styles.stepTitle, user.gender === 'male' ? {color: Colors.WHITE} : {color:Colors.BLACK}]}>1. Send an Email:</Text>
        <Text style={[styles.paragraph, user.gender === 'male' ? {color: Colors.WHITE} : {color:Colors.BLACK}]}>
          Please send an email to{" "}
          <Text style={styles.email}>support@aasalonstudio.com</Text> with the
          subject "Account Deletion Request."
        </Text>
        <Text style={[styles.stepTitle, user.gender === 'male' ? {color: Colors.WHITE} : {color:Colors.BLACK}]}>2. Include Details:</Text>
        <Text style={[styles.paragraph, user.gender === 'male' ? {color: Colors.WHITE} : {color:Colors.BLACK}]}>
          In your email, specify your A&A Salon username and any additional
          information required to identify your account.
        </Text>
        <Text style={[styles.stepTitle, user.gender === 'male' ? {color: Colors.WHITE} : {color:Colors.BLACK}]}>3. Data Deletion:</Text>
        <Text style={[styles.paragraph, user.gender === 'male' ? {color: Colors.WHITE} : {color:Colors.BLACK}]}>
          Upon receiving your request, we will delete all personal data
          associated with your account, including your name, email, and phone
          number.
        </Text>
        <Text style={[styles.stepTitle, user.gender === 'male' ? {color: Colors.WHITE} : {color:Colors.BLACK}]}>4. Retention Period:</Text>
        <Text style={[styles.paragraph, user.gender === 'male' ? {color: Colors.WHITE} : {color:Colors.BLACK}]}>
          Any non-personal data necessary for legal or operational purposes will
          be retained for 30 days after account deletion.
        </Text>
        <Text style={[styles.thankYou, user.gender === 'male' ? {color: Colors.WHITE} : {color: Colors.BLACK}]}>Thank you for using A&A Salon!</Text>
        <Text style={[styles.paragraph, user.gender === 'male' ? {color: Colors.WHITE} : {color:Colors.BLACK}]}>
          If you have any questions or concerns, please don't hesitate to email
          us: <Text style={styles.email}>support@aasalonstudio.com</Text>.
        </Text>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  container1: {
    flex: 1,
    backgroundColor: Colors.BLACK,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  email: {
    color: "blue",
    textDecorationLine: "underline",
  },
  thankYou: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },
  headerFemale: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.GOLD,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GOLD,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
