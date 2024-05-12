import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";

export default function Header() {
    return (
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Tan.ma Orders" titleStyle={styles.title} />
        <StatusBar backgroundColor="#ED711B" />
      </Appbar.Header>
    );
  }
  
  const styles = StyleSheet.create({
    header: {
      backgroundColor: '#ED711B', // Set your header background color
      elevation: 0, // Remove shadow on Android
      shadowOpacity: 0, // Remove shadow on iOS
      borderBottomWidth: 0, // Remove bottom border
    },
    title: {
      color: '#fff', // Set your header title color
      fontSize: 20, // Set your header title font size
    },
  });