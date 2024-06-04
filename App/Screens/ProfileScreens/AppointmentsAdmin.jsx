import React, { useContext, useState, useEffect } from "react";
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
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../Utils/Colors";
import LogoGold from "../../../assets/Images/Logo/logo2Gold.png";
import axiosClient from "../../axios";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../../store/UserContext";

const AppointmentsAdmin = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { user, barbers, } = useContext(UserContext);

  const [usersAll, setUsersAll] = useState([]);

  const navigation = useNavigation();

  // Function to navigate to the Register screen
  const navigateBack = () => {
    navigation.goBack();
  }

  useEffect(() => {
    appointmentsAdminFetch();
  }, []);

  const appointmentsAdminFetch = async () => {

    try {
      const response = await axiosClient.get(`/api/getAppointmentsAdmin/${user.id}`);

      if (response.data != '') {
        const user = response.data.map(appointment => appointment.user);
        setAppointments(response.data);
        setUsersAll(user);
        // console.log("Successfully fetched data", response.data);
        setError('');
      } else {
        // Handle login failure
        // console.log("No appointments found:", response.data);
        // setError('No appointments found.');
      }
    } catch (err) {
      console.error(
        "Failed to fetch appointments:",
        err.response,
        err,
        err.response.data
      );
      setError("Failed to fetch appointments.");
    }
  };
  

  const isAppointmentActive = (appointment) =>{
    const appointmentDateTime = new Date(appointment.date+ 'T' +appointment.time);
    const currentDateTime = new Date();
    const twoHoursBeforeAppointment = new Date(appointmentDateTime);
    twoHoursBeforeAppointment.setHours(appointmentDateTime.getHours() - 2);

    return {
        isActive: currentDateTime < appointmentDateTime,
        currentDateTime,
        twoHoursBeforeAppointment
      };
  };
  

  const cancelAppointmentAdmin = async (appointment) =>{
    // console.log(appointment);
    if(!appointment){
      setError("Ka ndodhur nje gabim!");
      return;
    }
    const { isActive } =
    isAppointmentActive(appointment);
    try {
      if(isActive){
        const response = await axiosClient.post(`/api/cancelAppointmentAdmin/${appointment.id}`);
        if(response.data.success){
          setSuccess("Termini u anulua me sukses.");
          appointmentsAdminFetch();
        }
      }else{
        setError("Termini nuk është aktiv.")
      }
      } catch (error) {
      console.error(
        "Failed to cancel appointment:",
        error.response,
        error,
        error.response.data
      );
    }
  }

const confirmCancelAppointment = (appointment) => {
    Alert.alert(
      "Konfirmimi",
      "A jeni i sigurt që dëshironi të anuloni termin?",
      [
        {
          text: "Jo",
          style: "cancel",
        },
        {
          text: "Po",
          onPress: () => cancelAppointmentAdmin(appointment),
        },
      ],
      { cancelable: true }
    );
  };
 
  const activeAppointments = appointments.filter(appointment => isAppointmentActive(appointment).isActive);
  const inActiveAppointment = appointments.filter(appointment => !isAppointmentActive(appointment).isActive);

  return (
    <View style={[user.gender === 'male' ? styles.container : styles.containerFemale ]}>
      <View style={[user.gender === 'male' ? styles.header : styles.headerFemale]}>
        <TouchableOpacity onPress={navigateBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Terminet e berberit</Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <Text style={[user.gender === 'male' ? styles.sectionTitle : styles.sectionTitleFemale]}>Terminet e pa përfunduara</Text>
          {activeAppointments.length > 0 ? (
            activeAppointments.map((appointment, index) => {
              const users = usersAll.find(users => users.id === appointment.customer_id) || { name: 'Unknown User' };
              return (
                <TouchableOpacity key={index} onPress={() => confirmCancelAppointment(appointment)} style={[user.gender === 'male' ? styles.card : styles.cardFemale]}>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardText}>
                      {`${user.gender === "male" ? `Klienti` : `Klientja`}: ${users.name} - ${new Date(appointment.date).toLocaleDateString('en-GB')} - ${appointment.time}`}
                    </Text>
                   
                    <Ionicons
                      name="close-circle-outline"
                      size={30}
                      color="red"
                    />
                </View>
                  </TouchableOpacity>
              );
            })
          ) : (
            <Text style={styles.noAppointmentText}>Nuk keni termine </Text>
          )}
          {error !== '' && <Text style={styles.errorText}>{error}</Text>}
          {success !== '' && <Text style={styles.success}>{success}</Text>}
        </View>
        <View style={styles.section}>
          <Text style={[user.gender === 'male' ? styles.sectionTitle : styles.sectionTitleFemale]}>Terminet e përfunduara</Text>
          {inActiveAppointment.length > 0 ? (
            inActiveAppointment.map((appointment, index) => {
              const users = usersAll.find(users => users.id === appointment.customer_id) || { name: 'Unknown User' };
              return (
                <View key={index} style={[user.gender === 'male' ? styles.card : styles.cardFemale , user.gender === 'male' ? styles.inactiveCard : styles.inactiveCardFemale]}>
                  <View style={styles.cardContent}>
                    <Text style={[styles.inactiveCardText]}>
                      {`${users.name} ${users.username} - ${new Date(appointment.date).toLocaleDateString('en-GB')} - ${appointment.time}`}
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={styles.noAppointmentText}>Nuk keni termine te përfunduara</Text>
          )}
        </View>
      </ScrollView>
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
    backgroundColor: Colors.BLACK,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'outfit-md',
    color: Colors.WHITE,
    fontSize: 18,
    marginBottom: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    fontFamily: 'outfit-md',
    color: 'green',
    fontSize: 16,
  },
  inactiveCard: {
    backgroundColor: Colors.WHITE,
  },
  inactiveCardText: {
    fontFamily: 'outfit-md',
    color: Colors.BLACK,
    fontSize: 16,
  },
  noAppointmentText: {
    fontFamily: 'outfit-md',
    color: 'gray',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    fontFamily: 'outfit-md',
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
  success: {
    fontFamily: 'outfit-md',
    color: 'green',
    fontSize: 16,
    marginTop: 10,
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
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
 
  sectionTitleFemale: {
    fontFamily: 'outfit-md',
    color: Colors.BLACK,
    fontSize: 18,
    marginBottom: 10,
  },
  cardFemale: {
    backgroundColor: Colors.GOLD,
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: Colors.GOLD,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  inactiveCardFemale: {
    backgroundColor: Colors.GOLD,
  },
});


export default AppointmentsAdmin;
