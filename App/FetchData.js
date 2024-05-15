import * as Notifications from "expo-notifications";
import { getData, storeData } from "./AsyncStorage";

const DataAPI = async () => {
    try {
      let data = await fetch(
        "https://sheets.googleapis.com/v4/spreadsheets/10bZWv4KdlRFdji-ZQBxWLnerA6sGMD1Jtj9KKCF3m6k/values/sheet1?valueRenderOption=FORMATTED_VALUE&key=AIzaSyCMS2ORuFyuDYgYFuQMloChgjTTCJdjhrQ"
      );
      let { values } = await data.json();
      let [, ...Data] = values.map((data) => data);
      return Data;
    } catch (error) {
        console.error("Error fetching data:", error);
        console.log("Error");
    }
  };


  const sendNotification = async () => {
    try {
      console.log("Sending push notification...");

      Notifications.scheduleNotificationAsync({
        content: {
          title: "Nouvelle commande dans Tan.ma! 🎉",
          body: "Ouvrir l'application pour voir la nouvelle commande! 🚀",
        },
        trigger: null
      });
      
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

export const fetchAndNotifyInBackground = async () => {
  try {
    const data = await DataAPI();
    const newLength = data.length;
    const previous_length = await getData('previous_length');
    await storeData('previous_length',newLength);
    
    if (data && newLength > previous_length) {
      console.log(
        "New Order Received:",
        newLength - previous_length,
        "new items added"
      );
      sendNotification();

      return ({data,length:newLength});
    } else {
      console.log("No new orders received.");
      return null;
    }
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
};


export default DataAPI;
  