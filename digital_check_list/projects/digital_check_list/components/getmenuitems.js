import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from 'expo-router';

const MenuItem = ({ item }) => {
  const router = useRouter();

  const handlePress = () => {
    router.navigate({
      pathname: "/Digital_Checklist_App/checkListEdit",
      params: {
        taskID: item.taskID,
        ipnumber: item.ipnumber,
        header: item.taskName.replace(/\+/g, " "),
      },
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Drafted":
        return "#1aa3ff";
      case "Completed":
        return "#0F0";
      case "Pending":
        return "#FFA500";
      default:
        return "#CCC";
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.menuItem,
        { backgroundColor: pressed ? getStatusColor(item.status) : "#fff" },
      ]}
    >
      <View style={styles.iconContainer}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.iconText}>
            {item.status === "Completed" ? "C" : item.status === "Pending" ?
              "P" : item.status === "Drafted" ? "D" : ""}
          </Text>
        </View>
      </View>
      <View style={styles.textGroup}>
        <View style={styles.textRow}>
          <Text style={styles.menuItemText}>{item.taskID}</Text>
          <Text style={styles.menuItemText}>{item.ipnumber}</Text>
        </View>
        <View style={styles.textRow}>
          <Text style={styles.menuItemText}>
            {item.bedCode}/{item.ward}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,         // Keep this for separation between items
        borderBottomColor: "#ccc",    // Add this to define the border color
        borderTopLeftRadius: 8,       // Optional: rounded corners on the top
        borderTopRightRadius: 8,      // Optional: rounded corners on the top
        marginBottom: 8,
        backgroundColor: "#fff",
      },
      
  textGroup: {
    flex: 1,
    marginLeft: 12,
  },
  textRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  menuItemText: {
    fontSize: 14,
    color: "#000000",
    fontFamily: "Mullish",
    fontWeight:"bold"
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MenuItem;
