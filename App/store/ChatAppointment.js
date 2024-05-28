import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { connect, pusher } from "../pusher";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatAppointmentContext = createContext();

const ChatAppointmentProvider = ({ children }) => {
  const { user, token, isLogged } = useContext(UserContext);

  //Chat and Dates Incoming
  const [incomingBookingDate, setIncomingBookingDate] = useState({});
  const [incomingMessages, setIncomingMessages] = useState({});
  const [isFocusedChatApp, setIsFocusedChatApp] = useState(false);
  const [isOnChatApp, setIsOnChatApp] = useState(false);

  useEffect(() => {
    global.isChatScreenFocused = isFocusedChatApp;
  }, [isFocusedChatApp]);

  useEffect(() => {
    global.isOnChatAppScreen = isOnChatApp;
  }, [isOnChatApp]);

  //Handling data for when a customer makes an appointment
  const handleEvent = (event) => {
    const eventData = JSON.parse(event.data);
    if ("barber_id" in eventData && "booking_id" in eventData) {
      const bookingDate = {
        barber_id: eventData.barber_id,
        date: eventData.date,
        time: eventData.time,
      };
      setIncomingBookingDate(bookingDate);
    } else if ("receiverId" in eventData && "receiverName" in eventData) {
      const message = JSON.parse(event.data);
      setIncomingMessages(message);
    }
  };

  const connectToPusherBookingPlaced = async () => {
    try {
      await connect(token, "booking-placed", handleEvent);
    } catch (err) {
      console.log(err);
    }
  };

  const connectToPusherChat = async () => {
    try {
      await connect(token, `private-chat.${user.id}`, handleEvent);
    } catch (err) {
      console.log(err);
    }
  };

  const disconnectToPusher = async () => {
    try {
      await pusher.unsubscribe({
        channelName: "booking-placed",
      });
      await pusher.unsubscribe({
        channelName: `private-chat.${user.id}`,
      });
      await pusher.disconnect();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log('A ppo provojm me hyn');
    if (isLogged) {
      console.log('A jemi mrenda aaaa');
      connectToPusherBookingPlaced();
      connectToPusherChat();
    }

    return () => {
      console.log('A po provojm me dal');
      disconnectToPusher();
    };
  }, [isLogged]);

  return (
    <ChatAppointmentContext.Provider
      value={{
        incomingBookingDate,
        incomingMessages,
        isFocusedChatApp,
        setIsFocusedChatApp,
        isOnChatApp,
        setIsOnChatApp,
      }}
    >
      {children}
    </ChatAppointmentContext.Provider>
  );
};
export { ChatAppointmentContext, ChatAppointmentProvider };
