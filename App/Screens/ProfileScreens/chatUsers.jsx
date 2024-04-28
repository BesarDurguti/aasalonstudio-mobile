import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axiosClient from "../../axios";
import { UserContext } from "../../store/UserContext";
import Colors from "../../Utils/Colors";
import { ChatAppointmentContext } from "../../store/ChatAppointment";

const ChatUsers = () => {
  // Navigation to go back
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  //getting the users
  const [users, setUsers] = useState([]);
  const { user } = useContext(UserContext);

  const fetchUsers = async () => {
    try {
      const response = await axiosClient.get("/api/users", {
        params: {
          id: user.id,
          isBarber: user.isBarber,
          gender: user.gender,
        },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error.response.data);
    }
  };

  const { incomingMessages, setIsFocusedChatApp } = useContext(
    ChatAppointmentContext
  );

  useEffect(() => {
    if (!global.isOnChatAppScreen) {
      setUsers((prevUsers) => {
        // Find the index of the user
        const userIndex = prevUsers.findIndex(
          (user) => user.id === incomingMessages.userId
        );
        if (userIndex !== -1) {
          // Copy the user
          const user = { ...prevUsers[userIndex] };
          // Update the total_unread count
          user.total_unread = parseInt(user.total_unread) + 1;
          // Copy the users array
          const updatedUsers = [...prevUsers];
          // Remove the user from its current position
          updatedUsers.splice(userIndex, 1);
          // Add the user to the beginning of the array
          updatedUsers.unshift(user);
          // Return the updated users array
          return updatedUsers;
        }
        // If the user is not found, return the previous users array
        return prevUsers;
      });
    }
  }, [incomingMessages]);

  useEffect(() => {
    setIsFocusedChatApp(true);
    fetchUsers();

    return () => {
      setIsFocusedChatApp(false);
    };
  }, []);

  const navigateToChat = (user) => {
    // Navigate to the Chat
    navigation.navigate("Chat", {
      userId: user.id,
      name: user.name,
      username: user.username,
    });

    setUsers((prevUsers) => {
      const userIndex = prevUsers.findIndex((u) => u.id === user.id);
      if (userIndex !== -1) {
        const updatedUsers = [...prevUsers];
        updatedUsers[userIndex] = {
          ...updatedUsers[userIndex],
          total_unread: 0,
        };
        return updatedUsers;
      }
      return prevUsers;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => handleGoBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Bisedat</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {users.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={styles.userItem}
            onPress={() => navigateToChat(user)}
            // onPress={() =>
            //   navigation.navigate("Chat", {
            //     userId: user.id,
            //     name: user.name,
            //     username: user.username,
            //   })
            // }
          >
            <Text style={styles.userName}>
              {user.name} {user.username}
            </Text>
            {user.total_unread > 0 && (
              <Text
                style={[
                  styles.userName,
                  {
                    color: Colors.GOLD,
                  },
                ]}
              >
                {user.total_unread}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
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
    backgroundColor: "#333",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  backButton: {
    marginRight: 10,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  userItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: {
    color: "#fff",
    fontSize: 18,
  },
});

export default ChatUsers;
