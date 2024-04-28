import PushNotification, { Importance } from "react-native-push-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";

const createNotificationChannel = async () => {
  PushNotification.createChannel(
    {
      channelId: "test2", // (required)
      channelName: "My channel", // (required)
      playSound: true, // (optional) default: true
      soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
      importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    },
    async (created) => {
      console.log(`createChannel returned '${created}'`); // (optional) callback returns whether the channel was created, false means it already existed.
      if (created) {
        await AsyncStorage.setItem("isChannelCreated", "true");
      }
    }
  );
};

const initPushNotification = () => {
  // Must be outside of any component LifeCycle (such as `componentDidMount`).
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
      console.log("TOKEN:", token);
    },

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
    },

    // Should the initial notification be popped automatically
    popInitialNotification: true,

    requestPermissions: true,
  });

  createNotificationChannel();
};

const handleNotificationPusher = (notification) => {
  PushNotification.localNotification({
    channelId: "test2",
    title: notification.title, // Title of the notification
    message: notification.body, // Message of the notification
    playSound: true, // Should the notification play a sound
    soundName: "default", // Name of the sound to play
    smallIcon: "ic_launcher_logo",
  });
};

export { initPushNotification, handleNotificationPusher };
