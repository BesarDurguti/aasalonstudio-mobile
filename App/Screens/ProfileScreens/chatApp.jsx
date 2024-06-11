import React, { useContext, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Colors from "../../Utils/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import axiosClient from "../../axios";
import { UserContext } from "../../store/UserContext";
import { ChatAppointmentContext } from "../../store/ChatAppointment";

const ChatScreen = () => {
  // Ref for ScrollView
  const scrollViewRef = useRef(); // Ref for ScrollView

  //Get user from the UserContext
  const { user, token } = useContext(UserContext);

  //State for the messages
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  //Navigation and route
  const navigation = useNavigation();
  const route = useRoute();

  //Get the user name and username
  const [receiverName, setReceiverName] = useState("");
  const [receiverUsername, setReceiverUsername] = useState("");

  // const [incomingMessages, setIncomingMessages] = useState({});
  const { incomingMessages, setIsFocusedChatApp, setIsOnChatApp } = useContext(
    ChatAppointmentContext
  );

  const readMessages = async (userId) => {
    try {
      const res = await axiosClient.post("/api/read/message", {
        sender_id: userId,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setIsFocusedChatApp(true);
    setIsOnChatApp(true);
    return () => {
      readMessages(user.id);
      setIsFocusedChatApp(false);
      setIsOnChatApp(false);
    };
  }, []);

  //every time the selectedUserId changes , so the person changes we fetch the history
  useEffect(() => {
    const { userId, name, username } = route.params || {};
    if (userId) {
      setSelectedUserId(userId);
      setReceiverUsername(username);
      setReceiverName(name);
    }
    fetchChatHistory();
  }, [selectedUserId]);

  useEffect(() => {
    if (incomingMessages && Object.keys(incomingMessages).length > 0) {
      if (incomingMessages.userId === selectedUserId) {
        // console.log('Jemi ne incoming messages .....');
        // console.log(messages, incomingMessages);
        if (messages.length > 0) {
          const lastMessageIndex = messages.length - 1;

          const newMessage = {
            id: messages[lastMessageIndex].id + 1,
            message: incomingMessages.message,
            read: false,
            recipient_id: incomingMessages.receiverId,
            user_id: incomingMessages.userId,
          };

          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      }
    }
  }, [incomingMessages]);

  //Take chat history from backend
  const fetchChatHistory = async () => {
    if (!selectedUserId) return;

    try {
      const response = await axiosClient.get("/api/messages", {
        params: {
          sender_id: user.id,
          receiver_id: selectedUserId,
        },
      });
      if (response.data.messages) {
        setMessages(response.data.messages);
        // console.log(response.data.messages);
      }
    } catch (err) {
      console.log(err.response.data);
    }
  };

  //here we handle when the user sends a message
  const handleSendMessage = async () => {
    if (!message) return;
    let lastMessageIndex;
    if (messages.length === 0) {
      lastMessageIndex = 0;
    } else {
      lastMessageIndex = messages.length - 1;
    }

    // console.log('Jemi ne handleSend Message..........');
    // console.log('Last message index: ' +lastMessageIndex);

    const newMessage = {
      id: messages[lastMessageIndex] ? messages[lastMessageIndex].id + 1 : 0,
      message: message,
      read: false,
      user_id: user.id,
      recipient_id: selectedUserId,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    if (selectedUserId) {
      try {
        const formData = {
          user_id: user.id,
          recipient_id: selectedUserId,
          recipient_name: user.name,
          recipient_username: user.username,
          message: message,
        };

        setMessage("");

        const response = await axiosClient.post("/api/send-message", formData);
      } catch (err) {
        console.log(err);
      }
    }
  };

  //navigate go back
  const handleGoBack = () => {
    navigation.goBack();
  };

  // Scroll to bottom when messages change(everytime we type or send message , or receive it)
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  }, [messages]);

  useEffect(() => {
    // Add event listener for keyboard opening
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => scrollViewRef.current.scrollToEnd({ animated: true })
    );

    // Cleanup function
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const initialOffset = Platform.OS === 'ios' ? 60 : 30;
  const [keyboardOffset, setKeyboardOffset] = useState(initialOffset);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardOffset(initialOffset);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      if (Platform.OS === 'android') {
        setKeyboardOffset(0);
      }
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={keyboardOffset}
    >

    
    <SafeAreaView style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {receiverName} {receiverUsername}
        </Text>
      </View>
      <ScrollView
        style={styles.chatArea}
        ref={scrollViewRef} // Attach ref to ScrollView
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: false })
        }
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={
              message.user_id === user.id
                ? styles.messageSent
                : styles.messageReceived
            }
          >
            <Text style={styles.messageText}>{message.message}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          onChangeText={(text) => setMessage(text)}
          value={message}
          onSubmitEditing={Keyboard.dismiss}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.GOLD,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  backButton: {
    position: "absolute",
    left: 10,
  },
  backButtonText: {
    color: "#000",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  chatArea: {
    flex: 1,
    padding: 10,
    marginBottom: 10,
  },
  messageSent: {
    alignSelf: "flex-end",
    backgroundColor: Colors.GOLD,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    maxWidth: "70%",
  },
  messageReceived: {
    alignSelf: "flex-start",
    backgroundColor: "white",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    maxWidth: "70%",
  },
  messageSender: {
    color: "#000",
    marginBottom: 5,
  },
  messageText: {
    color: "#000",
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.GOLD,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.GOLD,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    color: Colors.GOLD,
  },
  sendButton: {
    backgroundColor: Colors.GOLD,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
});

export default ChatScreen;
