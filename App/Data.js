import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Card } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";

import FetchData from "./FetchData";

export default function Data() {
  const [value, setValue] = useState([]);

  const fetchData = async () => {
    try {
      const data = await FetchData();
      setValue(data);
    } catch (error) {
      // Handle error
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch

    const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Sort items by the last item added (in descending order)
  const sortedValue = [...value].sort((a, b) => b[0] - a[0]);

  if (!value) {
    return <ActivityIndicator size="large" animating={true} color="#ED711B" />;
  }

  return (
    <ScrollView>
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
