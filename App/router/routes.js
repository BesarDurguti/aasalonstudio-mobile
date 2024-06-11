// AppNavigator.js
import React, { useContext, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "../Screens/Navigations/TabNavigation";
import Register from "../Screens/LoginScreens/Register";
import Login from "../Screens/LoginScreens/Login";
import VerifyCode from "../Screens/LoginScreens/VerifyCode";
import SendCode from "../Screens/LoginScreens/SendCode";
import ResetPassword from "../Screens/LoginScreens/ResetPassword";
import { UserContext } from "../store/UserContext";
import ChatScreen from "../Screens/ProfileScreens/chatApp";
import chatUsers from "../Screens/ProfileScreens/chatUsers";
import ChangePassword from "../Screens/ProfileScreens/ChangePassword";
import AppointmentsUser from "../Screens/ProfileScreens/AppointmentsUser";
import AppointmentsAdmin from "../Screens/ProfileScreens/AppointmentsAdmin";
import DeleteAccount from "../Screens/ProfileScreens/DeleteAccount";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isLogged } = useContext(UserContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLogged ? (
          <>
            <Stack.Screen
              name="TabNavigation"
              component={TabNavigation}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{ headerShown: false, tabBarVisible: true }}
            />
            <Stack.Screen
              name="ChatUsers"
              component={chatUsers}
              options={{ headerShown: false, tabBarVisible: true }}
            />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePassword}
              options={{ headerShown: false, tabBarVisible: true }}
            />
            <Stack.Screen
              name="AppointmentsUser"
              component={AppointmentsUser}
              options={{ headerShown: false, tabBarVisible: true }}
            />
            <Stack.Screen
              name="AppointmentsAdmin"
              component={AppointmentsAdmin}
              options={{ headerShown: false, tabBarVisible: true }}
            />
            <Stack.Screen
              name="DeleteAccount"
              component={DeleteAccount}
              options={{ headerShown: false, tabBarVisible: true }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="VerifyCode"
              component={VerifyCode}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SendCode"
              component={SendCode}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPassword}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
