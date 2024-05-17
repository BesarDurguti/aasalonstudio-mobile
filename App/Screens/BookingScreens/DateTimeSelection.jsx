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

const DateTimeSelection = () => {
  //States
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [timeAppointment, setTimeAppointment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTimeBtn, setSelectedTimeBtn] = useState("");
  const [disabledDates, setDisabledDates] = useState({});
  const [bookedDates, setBookedDates] = useState([]);
  const [dateTimeErr, setDateTimeErr] = useState("");
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
          setDisabledDates(disabledDates);
        } else {
          setDisabledDates({});
        }

        // Create a new date object for 'today'
        let currentDate = new Date();

        // Format the current date
        let formattedDate = format(currentDate, "yyyy-MM-dd");

        // While the current date is in the disabled dates, increment the date by one day
        while (
          disabledDatesResponse.some((item) => item.date === formattedDate)
        ) {
          currentDate.setDate(currentDate.getDate() + 1);
          formattedDate = format(currentDate, "yyyy-MM-dd");
        }

        // Set the date state to the next available date
        setDate(formattedDate);

        setBookedDates(response.data.bookingDates);
      } catch (error) {
        console.error("Error fetching booking dates:", error);
      }
    };

    fetchBookingDates();
  }, [selectedBarber]);

  useEffect(() => {
    if (disabledDates[date]) {
      let currentDate = new Date(date);
      let nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);

      // If the next date is also disabled, set the date to the day after
      if (disabledDates[format(nextDate, "yyyy-MM-dd")]) {
        nextDate.setDate(nextDate.getDate() + 1);
        setDate(format(nextDate, "yyyy-MM-dd"));
      }
    }
  }, [disabledDates, date]);

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
    setDateTimeErr("");
  };

  const handleConfirm = () => {
    if (date && timeAppointment) {
      const formattedDate = new Date(date).toISOString().split("T")[0];
      setSelectedTime(timeAppointment);
      setSelectedDate(formattedDate);
      setShowModal(false);
      setText("Dita: " + formattedDate + ", Ora: " + timeAppointment);
      setDateTimeErr("");
    } else {
      setDateTimeErr("Ju lutem zgjidhni datën dhe kohën!");
    }
  };

  //Here is the function that creates the buttons to choose time
  const renderTimeButtons = () => {
    const timeSlots = [];
    const currentTime = new Date();
    const today = format(currentTime, "yyyy-MM-dd");

    for (let hour = 9; hour < 21; hour++) {
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
                    selectedColor: Colors.BLACK,
                  },
                  ...disabledDates,
                }}
              />
              <View style={style.timeSlotsContainer}>
                {renderTimeButtons()}
                {dateTimeErr ? (
                  <Text style={{ color: "red", fontWeight: "bold" }}>
                    {dateTimeErr}
                  </Text>
                ) : (
                  ""
                )}
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

export default DateTimeSelection;

const style = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.BLACK,
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
    borderColor: Colors.WHITE,
    color: Colors.GOLD,
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
    color: Colors.WHITE,
    marginBottom: 5,
  },
  textInput: {
    fontSize: 14,
    fontFamily: "outfit-md",
    color: Colors.WHITE,
  },
  cancelButton: {
    padding: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.BLACK,
  },
  confirmButton: {
    padding: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.BLACK,
  },
  buttonText: {
    color: Colors.BLACK,
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
    borderColor: "black",
    color: Colors.BLACK,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginBottom: 10,
  },
  timeButtonActive: {
    width: "45%",
    backgroundColor: Colors.BLACK,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginBottom: 10,
  },
  timeButtonText: {
    fontSize: 16,
    color: Colors.BLACK,
  },
  timeButtonTextActive: {
    fontSize: 16,
    color: Colors.WHITE,
  },
});
