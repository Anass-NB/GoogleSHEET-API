import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  Button,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Card } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import FetchData from "./FetchData";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Data() {
  const [value, setValue] = useState([]);
  const [initialLength, setInitialLength] = useState(0);
  // Use useRef to track the previous data length for efficient comparison
  const prevLengthRef = useRef(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const [isFetching, setIsFetching] = useState(false); // State for fetching indicator

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    console.log("Registering for push notifications...");
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log("token: ", token);
        setExpoPushToken(token);
      })
      .catch((err) => console.log(err));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;

    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "31372344-635d-415b-b9e8-fcbd0715ccfc",
        })
      ).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  const sendNotification = async () => {
    try {
      console.log("Sending push notification...");
      // notification message
      const message = {
        to: expoPushToken,
        sound: "default",
        title: "Nouvelle commande dans Tan.ma! 🎉",
        body: "Ouvrir l'application pour voir la nouvelle commande! 🚀",
      };

      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          host: "exp.host",
          accept: "application/json",
          "accept-encoding": "gzip, deflate",
          "content-type": "application/json",
        },
        body: JSON.stringify(message),
      });
      console.log("Notification sent successfully!");
    } catch (error) {
      console.error("Error sending notification:", error);
      Alert.alert("Error", "Failed to send notification");
    }
  };

  // const fetchData = async () => {

  //   setIsFetching(true); // Set indicator to true before fetching
  //   try {
  //     const data = await FetchData();
  //     setValue(data);

  //     const newLength = data.length; // Store fetched data length
  //     let hasNewItems = false; // Flag for new items

  //     // Check for new items only if data is actually fetched and length changed
  //     if (data && newLength > prevLengthRef.current) {

  //       console.log(
  //         "New Order Received:",
  //         newLength - prevLengthRef.current,
  //         "new items added"
  //       );
  //       async () => {
  //         await sendNotification(expoPushToken);
  //       }
  //       hasNewItems = true; // Set flag if new items found
  //       setInitialLength(newLength);
  //       prevLengthRef.current = newLength;
  //     } else {
  //       console.log("No new orders received.");
  //     }
  //     // if (hasNewItems) {
  //     //   async () => {
  //     //     await sendNotification(expoPushToken);
  //     //   }

  //     // }
  //   } catch (error) {
  //     // Handle error
  //     console.error("Error:", error.message);
  //     Alert.alert("Error", "Failed to fetch data. Please try again later."); // Consider user-friendly error handling
  //   } finally {
  //     setIsFetching(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchData(); // Initial fetch

  //   const intervalId = setInterval(fetchData, 10000); // Fetch data every 5 seconds

  //   return () => clearInterval(intervalId);
  // }, []);

  // Sort items, considering your preference for sorting by the last item added
  
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsElapsed((prevSecondsElapsed) => prevSecondsElapsed + 1);
      if (secondsElapsed % 10 === 0) {
        // Every 20 seconds
        fetchData(); // Fetch data
      }
      // if (secondsElapsed > 0 && secondsElapsed % 15 === 0) {
      //   // Every 30 seconds
      //   sendNotification(expoPushToken); // Send notification
      // }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [secondsElapsed]);

  const fetchData = async () => {
    try {
      const data = await FetchData();
      setValue(data);

      const newLength = data.length;
      let hasNewItems = false;

      if (data && newLength > prevLengthRef.current) {
        console.log(
          "New Order Received:",
          newLength - prevLengthRef.current,
          "new items added"
        );
        hasNewItems = true;
        sendNotification(expoPushToken); // Send notification

        setInitialLength(newLength);
        prevLengthRef.current = newLength;
      } else {
        console.log("No new orders received.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      Alert.alert("Error", "Failed to fetch data. Please try again later.");
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
  }, []);
  const sortedValue = [...value].sort((a, b) => b[0] - a[0]);

  if (!value) {
    return <ActivityIndicator size="large" animating={true} color="#ED711B" />;
  }

  return isFetching ? (
    <ActivityIndicator size="large" animating={true} color="#ED711B" />
  ) : (
    <ScrollView>
      <Button title="Send push notification" onPress={sendNotification} />

      <Text style={styles.orderCount}>
        Number of Orders: {sortedValue.length}
      </Text>
      {sortedValue.map((files, index) => (
        <Card key={index} style={styles.container}>
          <Card.Title
            title={!files[0] ? "Not Provided" : files[0]}
            left={() => (
              <AntDesign name="shoppingcart" size={24} color="black" />
            )}
          />
          <CardContent title="Order No" content={files[0]} />
          <CardContent title="Order" content={files[1]} />
          <CardContent title="Order Price" content={files[2]} />
        </Card>
      ))}
    </ScrollView>
  );
}

const CardContent = ({ title, content }) => (
  <Card.Content style={styles.card}>
    <Text style={styles.title}>{title}:</Text>
    <Text style={styles.paragraph}>{content || "Not Provided"}</Text>
  </Card.Content>
);

const styles = StyleSheet.create({
  container: {
    margin: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ED711B",
  },
  card: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 5,
    flexWrap: "wrap",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 15,
  },
  paragraph: {
    fontSize: 18,
  },
  orderCount: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#ED711B",
  },
});
