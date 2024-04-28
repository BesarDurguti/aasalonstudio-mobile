import React, { useContext, useState } from "react";
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../Utils/Colors";
import LogoGold from "../../../assets/Images/Logo/logo2Gold.png";
import axiosClient from "../../axios";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../../store/UserContext";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState('');

  const {user} = useContext(UserContext);

  const navigation = useNavigation();

  // Function to navigate to the Register screen
  const navigateBack = () => {
    navigation.goBack();
  }


  const changePassword = async () => {
    if (!newPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
        setError('Passwords do not match.');
        return;
    }

    try {
      const userData = {
        newPassword: newPassword,
      };

      const response = await axiosClient.post("/api/changePassword", userData);
    //   console.log(response);
      if (response.data.success) {
        console.log("Successfully changed the password", response.data);
        navigateBack();
        setError('');
      } else {
        // Handle login failure
        console.log("Sending code failed:", response.data);
        setError('Sending code failed!');
      }
    } catch (err) {
      console.error(
        "Error sendig code:",
        err.response,
        err,
        err.response.data
      );
      setError(err.response.data.message);
    }
  };

  return (
    <View style={[user.gender === 'male' ? styles.container : styles.containerFemale]}>
      <View style={[user.gender === 'male' ? styles.header : styles.headerFemale]}>
        <TouchableOpacity
          onPress={() => navigateBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Nderroni Fjalekalimin</Text>
      </View>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[user.gender === 'male' ? styles.headerTitle : styles.headerTitleFemale]}>Nderroni Fjalekalimin</Text>
          <View style={styles.view}>
            <Text style={[user.gender === 'male' ? styles.label : styles.labelFemale]}>Fjalekalimi i ri</Text>
            <TextInput
              style={[user.gender === 'male' ? styles.input : styles.inputFemale]}
              onChangeText={setNewPassword}
              secureTextEntry={true}
              placeholder="Shkruani fjalekalimin e ri"
              placeholderTextColor={user.gender === 'male' ? Colors.WHITE : Colors.GOLD}
            />
            <Text style={[user.gender === 'male' ? styles.label : styles.labelFemale]}>Rishkruani fjalekalimin e ri</Text>
            <TextInput
              style={[user.gender === 'male' ? styles.input : styles.inputFemale]}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
              placeholder="Rishkruani fjalekalimin e ri"
              placeholderTextColor={user.gender === 'male' ? Colors.WHITE : Colors.GOLD}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity style={[user.gender == 'male' ? styles.button : styles.buttonFemale]} onPress={changePassword}>
              <Text style={[user.gender === 'male' ? styles.buttonText : styles.buttonTextFemale]}>Nderroni Fjalekalimin</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BLACK,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'outfit-md',
    color: Colors.WHITE,
    textAlign: 'center',
    
  },
  view: {
    marginTop: 15,
  },
  label: {
    fontFamily: 'outfit-md',
    color: Colors.WHITE,
    marginBottom: 4,
    fontSize: 14,
    marginTop: 7
  },
  input: {
    width: 300,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: Colors.WHITE,
    borderRadius: 10,
    color: Colors.WHITE,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    padding: 10,
    textAlign: 'center',
    paddingHorizontal: 50,
    marginTop: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 13,
  },
  buttonText: {
    color: Colors.BLACK,
    textAlign: 'center',
    fontFamily: 'outfit-md',
    fontSize: 16,
  },
//new code
containerFemale: {
  flex: 1,
  backgroundColor: Colors.WHITE,
},
headerFemale: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: Colors.GOLD,
  padding: 15,
  borderBottomWidth: 1,
  borderBottomColor:  Colors.GOLD,
},
headerTitleFemale: {
  fontSize: 24,
  fontFamily: 'outfit-md',
  color: Colors.GOLD,
  textAlign: 'center',
  
},
labelFemale: {
  fontFamily: 'outfit-md',
  color: Colors.GOLD,
  marginBottom: 4,
  fontSize: 14,
  marginTop: 7
},
inputFemale: {
  width: 300,
  paddingVertical: 10,
  paddingHorizontal: 10,
  marginBottom: 5,
  borderWidth: 2,
  borderColor: Colors.GOLD,
  borderRadius: 10,
  color: Colors.GOLD,
},
buttonFemale: {
  padding: 10,
  textAlign: 'center',
  paddingHorizontal: 50,
  marginTop: 20,
  backgroundColor: Colors.GOLD,
  borderRadius: 13,
},
buttonTextFemale: {
  color: Colors.WHITE,
  textAlign: 'center',
  fontFamily: 'outfit-md',
  fontSize: 16,
},
});

export default ChangePassword;
