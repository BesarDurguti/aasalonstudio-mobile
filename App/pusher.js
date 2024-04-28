import { Pusher } from "@pusher/pusher-websocket-react-native";
import { useState } from "react";

const pusher = Pusher.getInstance();

let token;

const connect = async (tokenParam, channelNameProp, onEventCallback) => {
  token = tokenParam;
  try {
    await pusher.init({
      apiKey: "32b83f3894b7f0828d2c",
      cluster: "eu",
      onAuthorizer,
      onError,
      //   onEvent,
      onSubscriptionSucceeded,
      onSubscriptionError,
    });

    await pusher.connect();

    const channel = await pusher.subscribe({
      channelName: channelNameProp,
      onEvent: (event) => {
        onEventCallback(event); // Call the callback with the event data
      },
    });

    return channel;
  } catch (err) {
    console.log(err, "the error from connect");
  }
};
const onError = (message, code, error) => {
  console.log(`onError: ${message} code: ${code} exception: ${error}`);
};

const onSubscriptionSucceeded = (channelName, data) => {
  console.log(
    `onSubscriptionSucceeded: ${channelName} data: ${JSON.stringify(data)}`
  );
  const channel = pusher.getChannel(channelName);

  if (!channel) {
    return;
  } else {
    console.log(channel);
  }
};

const onSubscriptionError = (channelName, status, data) => {
  console.log(
    `onSubscriptionError: ${channelName} status: ${status} data: ${JSON.stringify(
      data
    )}`
  );
};

const onAuthorizer = async (channelName, socketId) => {
  const response = await fetch(
    process.env.REACT_NATIVE_API_URL + "/api/broadcasting/auth",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        socket_id: socketId,
        channel_name: channelName,
      }),
    }
  );

  const body = await response.json();

  return body;
};

export { connect, pusher };
