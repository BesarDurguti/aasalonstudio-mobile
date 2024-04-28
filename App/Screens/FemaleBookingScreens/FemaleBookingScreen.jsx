import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import FemaleBarberInformation from "./FemaleBarberInformation";
import FemaleServiceSelection from "./FemaleServiceSelection";
import FemaleDateTimeSelection from "./FemaleDateTimeSelection";
import Colors from "../../Utils/Colors";
import { UserContext } from "../../store/UserContext";
import axiosClient from "../../axios";
import { useNavigation } from "@react-navigation/native";

const FemaleAppointmentBookingScreen = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const {
    user,
    selectedBarber,
    selectedService,
    selectedTime,
    selectedDate,
    setSelectedService,
    setSelectedDate,
    setSelectedTime,
    setText,
    setValue,
  } = useContext(UserContext);

  const navigation = useNavigation();

  const handleRemoveInputDatas = async () => {
    setSelectedService({});
    setSelectedDate(null);
    setSelectedTime("");
    setText("");
    setValue([]);
    setError("");
    setSuccess("");
  };

  //init Pusher
  useEffect(() => {
    const unsubscribeBlur = navigation.addListener("blur", () => {
      handleRemoveInputDatas();
    });

    return () => {
      unsubscribeBlur();
    };
  }, [navigation]);

  const handleMakeAppointment = async () => {
    setIsSendingRequest(true);
    if (
      selectedBarber &&
      Object.keys(selectedBarber).length > 0 &&
      selectedDate &&
      selectedService &&
      Object.keys(selectedService).length > 0 &&
      selectedTime
    ) {
      const bookData = {
        user: user.id,
        barber: selectedBarber.id,
        // service: selectedService.id,
        service: selectedService.map((service) => service.id).join(","),
        date: selectedDate,
        time: selectedTime,
      };
      // console.log(bookData, selectedService);;
      try {
        const response = await axiosClient.post("/api/book", bookData);
        handleRemoveInputDatas();
        setError("");
        setSuccess("Termini u caktua me sukses");
        setIsSendingRequest(false);
      } catch (err) {
        if (err.response.data.status === "pending") {
          setSuccess("");
          setError(err.response.data.errors);
          setIsSendingRequest(false);
        }
      }
    } else {
      setIsSendingRequest(false);
      setError("Ju lutemi mbushini fushat!");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: Colors.WHITE }}>
      <FemaleBarberInformation />
      <FemaleServiceSelection />
      <FemaleDateTimeSelection/>
      {error !== '' && <Text style={style.errorText}>{error}</Text>}
      {success !== '' && <Text style={style.success}>{success}</Text>}
      
      {!isSendingRequest ? (
      <TouchableOpacity
        style={style.buttons}
        onPress={() => handleMakeAppointment()}
      >
        <Text
          style={{
            color: Colors.WHITE,
            textAlign: "center",
            fontFamily: "outfit-md",
            fontSize: 16,
          }}
        >
          Cakto Terminin
        </Text>
      </TouchableOpacity>
      ) : (
        <TouchableOpacity
        style={style.buttons}
        onPress={() => handleMakeAppointment()}
      >
        <Text
          style={{
            color: Colors.WHITE,
            textAlign: "center",
            fontFamily: "outfit-md",
            fontSize: 16,
          }}
        >
         <ActivityIndicator size="small" color={Colors.WHITE} />
        </Text>
      </TouchableOpacity>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  buttons: {
    padding: 10,
    textAlign: "center",
    paddingHorizontal: 50,
    marginTop: 20,
    backgroundColor: Colors.GOLD,
    borderRadius: 13,
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
});

export default FemaleAppointmentBookingScreen;
