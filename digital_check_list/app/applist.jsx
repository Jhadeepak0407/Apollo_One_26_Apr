import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown } from "react-native-element-dropdown";
import { Stack, useRouter } from "expo-router";

const menuItems = [
  { name: "Digital CheckList", icon: "checklist", color: "#4CAF50", route: "Digital_Checklist_App/TriggeredChecklist" },
  { name: "OT Booking", icon: "event", color: "#F44336" },
  { name: "Digital Pass", icon: "trending-up", color: "#E91E63" },
  { name: "Doctor HandsOff", icon: "person", color: "#FF9800" },
  { name: "Credential & Privilege", icon: "school", color: "#2196F3" },
  { name: "Discharge Tracker", icon: "store", color: "#8BC34A" },
];

const HomeScreen = () => {
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState(null);
  const [animatedValues] = useState(menuItems.map(() => new Animated.Value(0)));
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useRouter();

  useEffect(() => {
    try {
      axios
        .get("http://10.10.9.89:203/api/Users/GetAllLocationList")
        .then((response) => {
          console.log("APPLIST API => ", response)
          const fetchedLocations = response.data.map((loc) => ({
            value: loc.location_Id,
            label: loc.location_Display_Name,
          }));
          setLocations(fetchedLocations);
          setLocation(fetchedLocations[0]?.value);
        });
    } catch (error) {

      console.log("ERROR IN CALLING API at applist page", error);
    }

    const animations = animatedValues.map((animatedValue, index) => {
      return Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      });
    });

    Animated.stagger(100, animations).start();
  }, []);

  const renderItem = ({ item, index }) => {
    const animatedStyle = {
      transform: [
        { scale: animatedValues[index] },
        {
          translateY: animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }),
        },
      ],
      opacity: animatedValues[index].interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    };

    const navigateToPage = () => {
      switch (item.name) {
        case "Digital CheckList":
          navigation.push('CounterB');
          break;
        case "OT Booking":
          navigation.push('otBooking');
          break;
        case "Digital Pass":
          navigation.push('digitalPass');
          break;
        case "Doctor HandsOff":
          navigation.push('doctorHandOff');
          break;
        case "Credential & Privilege":
          navigation.push('credentialPrivilege');
          break;
        case "Discharge Tracker":
          navigation.push('dischargeTracker');
          break;
        default:
          console.log("No page found for this item");
      }
    };
    return (
      <Animated.View style={[styles.menuItem, animatedStyle]}>
        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: item.color }]}
          onPress={() => navigation.navigate(item.route)} 
        >
          <MaterialIcons name={item.icon} size={40} color="white" />
        </TouchableOpacity>
        <Text style={styles.menuText}>{item.name}</Text>
      </Animated.View>
    );
  };

  const handleLogout = () => {
    setModalVisible(false);
    navigation.navigate("login");
  };

  return (
    <View style={styles.container}>
       <Stack.Screen
        options={{title:"Home"}} />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.iconButton}
        >
          <MaterialIcons name="account-circle" size={28} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.dropdownContainer}>
        <Dropdown
          data={locations}
          labelField="label"
          valueField="value"
          value={location}
          search
          searchPlaceholder="Search..."
          onChange={(item) => {
            setLocation(item.value);
          }}
          placeholder="Select a location"
          style={styles.dropdown}
          containerStyle={styles.dropdownContainerStyle}
          selectedTextStyle={styles.dropdownSelectedText}
          placeholderStyle={styles.dropdownPlaceholder}
          inputSearchStyle={styles.dropdownInputSearch}
        />
      </View>

      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContainer}
      />

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C3E50",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  iconButton: {
    marginLeft: 15,
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdown: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  dropdownContainerStyle: {
    maxHeight: 140,
  },
  dropdownSelectedText: {
    color: "#333",
  },
  dropdownPlaceholder: {
    color: "#999",
  },
  dropdownInputSearch: {
    backgroundColor: "#fff",
    color: "#333",
  },
  flatListContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  menuItem: {
    flex: 1,
    margin: 10,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    paddingTop: 20,
  },
  menuButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333333",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 250,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#CCCCCC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelText: {
    color: "black",
    fontSize: 16,
  },
});

export default HomeScreen;
