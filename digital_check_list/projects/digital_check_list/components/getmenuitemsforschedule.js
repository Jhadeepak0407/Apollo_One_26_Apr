import React from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { useRouter } from 'expo-router';
 
const ScheduleMenuItem = ({ item }) => {
  const router = useRouter();
  const scaleAnim = new Animated.Value(1);
 
  const handlePress = () => {
    // Check if item and item.taskName are defined
    
    console.log("taskname",)
    router.navigate({
      pathname: "/Digital_Checklist_App/checklistEditSchedule",
     params: {
     
      cid:item.cid,
      finalSave:item.finalSave,
      sequenceNumber:item.sequenceNumber,
      checklistname:item.checkListName,
      header: item.taskName.replace(/\+/g, " "),

      },
    });
  };
  
  
 
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };
 
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
 
  const getStatusColor = (finalSave) => {
    switch (finalSave) {
      case "Drafted":
        return "#ffcc80";  // Blue for Drafted
      case "Completed":
        return "#27ae60";  // Green for Completed
      case "Pending":
        return "#b3cde0";  // Orange for Pending
      default:
        return "#bdc3c7";  // Default Gray
    }
  };
 
  return (
<Animated.View
      style={[
        styles.ScheduleMenuItem,
        {
          backgroundColor: getStatusColor(item.finalSave),
          transform: [{ scale: scaleAnim }],
        }
      ]}
>
<Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
>
<View style={styles.iconContainer}>
<View
            style={[
              styles.iconCircle,
              { backgroundColor: item.finalSave === "Pending" ? "#b3cde0" : getStatusColor(item.finalSave) },
            ]}
>
<Text style={styles.iconText}>
              {item.finalSave === "Completed" ? "C" : item.finalSave === "Pending" ?
                "P" : item.finalSave === "Drafted" ? "D" : ""}
</Text>
</View>
</View>
<View style={styles.textGroup}>
<View style={styles.textRow}>
<Text style={styles.ScheduleMenuItemText}>{item.sequenceNumber}</Text>
</View>
<View style={styles.textRow}>
<Text style={styles.ScheduleMenuItemText}>{item.taskName}</Text>
<Text style={styles.hourFormat}>{item.hourFormat}</Text>

</View>


</View>
</Pressable>
</Animated.View>
  );
};
 
const styles = StyleSheet.create({
  ScheduleMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 12,  // Rounded corners for a modern feel
    marginBottom: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,  // More elevation for better depth
    borderWidth: 0,  // Optional: Remove border to keep the design sleek
  },
 
  pressable: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
 
  textGroup: {
    flex: 1,
    marginLeft: 20,
    flexDirection: "column",  // Stack items vertically
  },
 
  // textRow: {
  //   flexDirection: "row",
  //   justifyContent: "flex-start",  // Align text to the left
  //   marginBottom: 2,
  // },
 
  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",  // Push hourFormat to the end
    alignItems: "center",
  },
  ScheduleMenuItemText: {
    fontSize: 16,
    color: "", // White text to contrast with the background color
    fontFamily: "Mullish", // Use system font for better performance
    fontWeight: "800",
  },
 
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
 
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e67e22",  // Default color for "Pending"
    shadowColor: "#000", // Shadow effect for better depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
 
  iconText: {
    fontSize: 18,
    color: "",
    fontWeight: "bold",
  },
  hourFormat: {
    fontSize: 14,
    fontWeight: "600",
    color: "", // Different color for distinction
    textAlign: "right", // Ensures it's aligned right
    flex: 1, // Allows it to take available space
  },
});
 
export default ScheduleMenuItem;