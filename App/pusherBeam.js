import { Platform } from "react-native";
import RNPusherPushNotifications from "react-native-pusher-push-notifications";
import { handleNotificationPusher } from "./PusherNotification";
///////////////////Pusher Beam/////////////////////

const connectPusherBeam = (
  interest,
  interest2,
  userId,
  parsedSubscriptionData
) => {
  RNPusherPushNotifications.setInstanceId(process.env.PUSHER_INSTANCE_ID);

  if (!parsedSubscriptionData || parsedSubscriptionData.userId !== userId) {
    RNPusherPushNotifications.on("registered", () => {
      subscribe(interest);
      subscribe(interest2);
    });
  }

  // Setup notification listeners
  RNPusherPushNotifications.on("notification", handleNotification);
};

const handleNotification = async (notification) => {
  if (!global.isChatScreenFocused) {
    console.log("From handleNotification", notification);
    if (Platform.OS === "ios") {
      console.log("CALLBACK: handleNotification (ios)");
    } else {
      console.log(
        "CALLBACK: handleNotification (android)",
        global.isChatScreenFocused
      );
      handleNotificationPusher(notification);
    }
  }
};

// Subscribe to an interest
const subscribe = (interest) => {
  console.log(`Subscribing to "${interest}"`);
  RNPusherPushNotifications.subscribe(
    interest,
    (statusCode, response) => {
      console.error(statusCode, response);
    },
    () => {
      console.log(`CALLBACK: Subscribed to ${interest}`);
    }
  );
};

export { connectPusherBeam };

/////////////////////////End Pusher Beam/////////////////////
