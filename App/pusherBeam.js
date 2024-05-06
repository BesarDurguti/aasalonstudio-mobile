import { Platform } from "react-native";
import RNPusherPushNotifications from "react-native-pusher-push-notifications";
import { handleNotificationPusher } from "./PusherNotification";
import axiosClient from "./axios";
///////////////////Pusher Beam/////////////////////


function onPusherInitError(statusCode, response) {
  console.log('Error: PUSHER statusCode: ', statusCode);
  console.log('Error: PUSHER response: ', response);
}

function onPusherInitSuccess(response) {
  console.log('PUSHER SUCCESS: ', response);
}

const connectPusherBeam = async (
  interest,
  interest2,
  userId,
  parsedSubscriptionData
) => {
  RNPusherPushNotifications.setInstanceId(process.env.PUSHER_INSTANCE_ID);

    RNPusherPushNotifications.on("registered", () => {
      subscribe(interest);
      subscribe(interest2);
    });

    const res = await axiosClient.get('/api/pusher/beams-auth',{
      params:{
        user_id: userId
      }
    });
    const {token} = res.data;

    setUser(`user-${userId}`, token, onPusherInitError, onPusherInitSuccess)

  // Setup notification listeners
  RNPusherPushNotifications.on("notification", handleNotification);
};

function setUser(userId, token,onError, onSuccess){
  RNPusherPushNotifications.setUserId(
    userId,
    token,
    (statusCode, response) => {
      onError(statusCode, response);
    },
    () => {
      onSuccess('Set User ID Success');
    }
  );
}

const handleNotification = async (notification) => {
  if (!global.isChatScreenFocused) {
    console.log("From handleNotification", notification);
    if (Platform.OS === "ios") {
      console.log("CALLBACK: handleNotification (ios)");
    } else {
      console.log(notification);
      handleNotificationPusher(notification);
    }
  }
};

// Subscribe to an interest
const subscribe = (interest) => {
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
