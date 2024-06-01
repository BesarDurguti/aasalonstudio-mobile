//new calendar code
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
} from "react-native";
import Colors from "../../Utils/Colors";
import { format, addMonths } from "date-fns";
import { Calendar } from "react-native-calendars";
import { UserContext } from "../../store/UserContext";
import axiosClient from "../../axios";
import { ChatAppointmentContext } from "../../store/ChatAppointment";

const FemaleDateTimeSelection = () => {
  //States
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [timeAppointment, setTimeAppointment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTimeBtn, setSelectedTimeBtn] = useState("");
  const [disabledDates, setDisabledDates] = useState({});
  const [bookedDates, setBookedDates] = useState([]);
  const maxDate = format(addMonths(new Date(), 1), "yyyy-MM-dd");
  const minDate = format(new Date(), "yyyy-MM-dd");

  //Contexts
  const { setSelectedTime, setSelectedDate, selectedBarber, text, setText } =
    useContext(UserContext);
  const { incomingBookingDate } = useContext(ChatAppointmentContext);

  //Update time and date when an appointment was made
  useEffect(() => {
    if (incomingBookingDate.date && incomingBookingDate.time) {
      setBookedDates((prevBookedDates) => [
        ...prevBookedDates,
        incomingBookingDate,
      ]);
    }
  }, [incomingBookingDate]);

  //Get all booked dates when u select a certain barber
  useEffect(() => {
    const fetchBookingDates = async () => {
      try {
        if (!selectedBarber) return;
        const response = await axiosClient.get(
          `/api/getAppointments/${selectedBarber.id}`
        );

        const disabledDatesResponse = response.data.disabledDates;
        if (disabledDatesResponse.length > 0) {
          const disabledDates = disabledDatesResponse.reduce((acc, date) => {
            return {
              ...acc,
              [date.date]: {
                disabled: true,
                disableTouchEvent: true,
              },
            };
          }, {});
          // console.log(disabledDates);
          setDisabledDates(disabledDates);
        } else {
          setDisabledDates({});
        }

        setBookedDates(response.data.bookingDates);
      } catch (error) {
        console.error("Error fetching booking dates:", error);
      }
    };

    fetchBookingDates();
  }, [selectedBarber]);

  //Functions for toggle and work with date and time
  const toggleDatePicker = () => {
    setShowModal(!showModal);
  };

  const onDayPress = (day) => {
    setDate(day.dateString);
  };

  const handleTimeSelect = (time) => {
    setTimeAppointment(time);
    setSelectedTimeBtn(time);
  };

  //Function to cancel and confirm the selected date and time
  const handleCancel = () => {
    setDate(format(new Date(), "yyyy-MM-dd")); // Clear the selected date
    setText("");
    setSelectedTime("");
    setTimeAppointment("");
    setSelectedTimeBtn("");
    setSelectedDate(null);
    setShowModal(false); // Hide the modal
  };

  const handleConfirm = () => {
    if (date && timeAppointment) {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      setSelectedTime(timeAppointment);
      setSelectedDate(formattedDate);
      setShowModal(false);
      setText("Dita: " + formattedDate + ", Ora: " + timeAppointment);
    } else {
      console.log("Please choose time and date");
    }
  };

  //Here is the function that creates the buttons to choose time
  const renderTimeButtons = () => {
    const timeSlots = [];
    const currentTime = new Date();
    const today = format(currentTime, "yyyy-MM-dd");

    for (let hour = 7; hour < 21; hour++) {
      for (let minutes of ["00", "30"]) {
        const time = `${hour}:${minutes}`;
        const isActive = selectedTimeBtn === time; // Check if the button's time is selected
        const buttonStyle = isActive
          ? style.timeButtonActive
          : style.timeButton;
        const textStyle = isActive
          ? style.timeButtonTextActive
          : style.timeButtonText;

        const isBooked = bookedDates.some(
          (booking) => booking.date === date && booking.time === time
        );

        if (date == today) {
          if (new Date(`${date} ${time}`) > currentTime) {
            if (!isBooked) {
              timeSlots.push(
                <TouchableOpacity
                  key={time}
                  style={buttonStyle}
                  onPress={() => handleTimeSelect(time)}
                >
                  <Text style={textStyle}>{time}</Text>
                </TouchableOpacity>
              );
            }
          }
        } else {
          if (!isBooked) {
            timeSlots.push(
              <TouchableOpacity
                key={time}
                style={buttonStyle}
                onPress={() => handleTimeSelect(time)}
              >
                <Text style={textStyle}>{time}</Text>
              </TouchableOpacity>
            );
          }
        }
      }
    }
    return timeSlots;
  };

  return (
    <ScrollView contentContainerStyle={style.container}>
      <Text style={style.text}>Dita Dhe Ora</Text>

      {/* Modal that shows the calendar and time */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={false}
        presentationStyle="formSheet"
      >
        <View /*style={style.modalContainer} */>
          <ScrollView>
            <View style={style.modalContent}>
              <Calendar
                current={date}
                minDate={minDate}
                maxDate={maxDate}
                onDayPress={onDayPress}
                markedDates={{
                  [format(date, "yyyy-MM-dd")]: {
                    selected: true,
                    selectedColor: Colors.GOLD,
                  },
                  ...disabledDates,
                }}
              />
              <View style={style.timeSlotsContainer}>
                {renderTimeButtons()}
              </View>
              <View style={style.buttonContainer}>
                <View style={style.buttonWrapper}>
                  <TouchableOpacity
                    onPress={() => handleCancel()}
                    style={style.cancelButton}
                  >
                    <Text style={style.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
                <View style={style.buttonWrapper}>
                  <TouchableOpacity
                    onPress={() => handleConfirm()}
                    style={style.confirmButton}
                  >
                    <Text style={style.buttonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
      {/* /********************** */}
      <Pressable onPress={toggleDatePicker}>
        <View style={style.buttonStyle}>
          <Text style={style.textInput} onPressIn={toggleDatePicker}>
            {text}
          </Text>
        </View>
      </Pressable>
    </ScrollView>
  );
};

export default FemaleDateTimeSelection;

const style = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.WHITE,
  },
  // modalContainer: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  modalContent: {
    height: "90%", // Adjusted height
    width: "100%", // Adjusted width
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  buttonStyle: {
    borderWidth: 1,
    borderColor: Colors.GOLD,
    color: Colors.WHITE,
    padding: 15,
    justifyContent: "center",
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 10,
  },
  text: {
    fontSize: 14,
    fontFamily: "outfit-b",
    color: Colors.GOLD,
    marginBottom: 5,
  },
  textInput: {
    fontSize: 14,
    fontFamily: "outfit-md",
    color: Colors.GOLD,
  },
  cancelButton: {
    padding: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.GOLD,
  },
  confirmButton: {
    padding: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.GOLD,
  },
  buttonText: {
    color: Colors.GOLD,
    fontSize: 14,
    fontFamily: "outfit-md",
    textAlign: "center", // Added textAlign property
  },
  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  timeButton: {
    width: "45%",
    backgroundColor: Colors.WHITE,
    borderWidth: 2,
    borderColor: Colors.GOLD,
    color: Colors.GOLD,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginBottom: 10,
  },
  timeButtonActive: {
    width: "45%",
    backgroundColor: Colors.GOLD,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginBottom: 10,
  },
  timeButtonText: {
    fontSize: 16,
    color: Colors.GOLD,
  },
  timeButtonTextActive: {
    fontSize: 16,
    color: Colors.WHITE,
  },
});
