import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
  Modal,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown } from "react-native-element-dropdown";
import { Stack, useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";


const menuItems = [
  { name: "Digital CheckList", icon: "checklist", color: "#4CAF50", route: "Digital_Checklist_App/TypeofCheckList" },
  { name: "OT Booking", icon: "event", color: "#F44336" },
  { name: "Digital Pass", icon: "trending-up", color: "#E91E63", route: "Digital_Pass/home", image: require('../assets/images/digital_pass_icon.png') },
  { name: "Doctor HandsOff", icon: "person", color: "#FF9800" },
  { name: "Credential & Privilege", icon: "school", color: "#2196F3" },
  { name: "Discharge Tracker", icon: "store", color: "#8BC34A" },
];


const HomeScreen = () => {
  const [locations, setLocations] = useState([null]);
  const [location, setLocation] = useState(null);
  const [animatedValues] = useState(menuItems.map(() => new Animated.Value(0)));
  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const navigation = useRouter();


   // On page load, read `selectedLocation` from local storage and set it
   useEffect(() => {
    const loadLocation = async () => {
      try {
        const authDataJson = await AsyncStorage.getItem("auth"); // Retrieve auth data from AsyncStorage
        if (authDataJson) {
          const authData = JSON.parse(authDataJson); // Parse the stored auth data
          if (authData.selectedLocation) {
            setLocation(authData.selectedLocation); // Set the location from AsyncStorage
          }
        }
      } catch (error) {
        console.error('Failed to load authData from AsyncStorage:', error);
      }
    };

    loadLocation();
  }, []); // Empty dependency array ensures this runs only on page load


  function handleLocationChange(item) {
    const newValue = item.value;
    
    // Retrieve the current `AuthData` object from AsyncStorage
    AsyncStorage.getItem("auth")
      .then((authDataJson) => {
        if (authDataJson) {
          // Parse the auth data
          let authData = JSON.parse(authDataJson);
  
          // Check if `authData` exists and has a non-null `id`
          if (authData && authData.id !== null) {
            // Add or update the `selectedLocation` key
            authData.selectedLocation = newValue;
  
            // Save the updated object back to AsyncStorage
            AsyncStorage.setItem("auth", JSON.stringify(authData))
              .then(() => {
              })
              .catch((error) => {
              });
          }
        }
      })
      .catch((error) => {
        console.error('Failed to load authData:', error);
      });
  
    // Update component state or perform additional logic
    setLocation(newValue);
  }


  useEffect(() => {
    try {
      axios
        .get("http://10.10.9.89:203/api/Users/GetAllLocationList")
        .then((response) => {
          const fetchedLocations = response.data.map((loc) => ({
            value: loc.location_Id,
            label: loc.location_Display_Name,
          }));
          setLocations(fetchedLocations);
          //////  setLocation(fetchedLocations[0]?.value);
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
      if (!location) {
        // Show alert if location is not selected
        //// alert('Please select a location before proceeding.');
        setAlertVisible(true);
      }
      else {
        // Navigate to the selected page if location is selected
        switch (item.name) {
          case "Digital CheckList":
            navigation.navigate('Digital_Checklist_App/TypeofCheckList');
            break;
          case "OT Booking":
            navigation.navigate('Digital_Pass/123');
            break;
          case "Digital Pass":
            navigation.navigate('Digital_Pass/home');
            break;
          case "Doctor HandsOff":
            navigation.navigate('doctorHandOff');
            break;
          case "Credential & Privilege":
            navigation.navigate('credentialPrivilege');
            break;
          case "Discharge Tracker":
            navigation.navigate('dischargeTracker');
            break;
          default:
            if (item.route) {
              ////console.log("URL",item.route);
              navigation.navigate(item.route);
            } else {
              console.log("No page found for this item");
            }
        }
      }
    };
    return (
      <Animated.View style={[styles.menuItem, animatedStyle]}>
      <TouchableOpacity
        style={[styles.menuButton, { backgroundColor: item.color }]}
        onPress={() => {
          navigateToPage();
        }}
      >
        {item.image ? (
          // Render an image if the item has an `image` property
          <Image
  source={item.image}
  style={{ width: 110, height: 110, resizeMode: "contain" }}
/>
        ) : (
          // Otherwise, render the MaterialIcons icon
          <MaterialIcons name={item.icon} size={40} color="white" />
        )}
      </TouchableOpacity>
      <Text style={styles.menuText}>{item.name}</Text>
    </Animated.View>
    
    );
  };

  const dispatch = useDispatch();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("auth");
    dispatch({ type: "LOGOUT" })
    setModalVisible(false);
    navigation.navigate("login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.iconButton}
        >
          <MaterialIcons name="account-circle" size={28} cFolor="white" />
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
          onChange={(item) => handleLocationChange(item)}

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
      {/* Alert Modal for Location Selection */}
      <Modal
        transparent={true}
        visible={alertVisible}
        animationType="slide"
        onRequestClose={() => setAlertVisible(false)}
      >
        <View style={styles.alertContainer}>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Location Required</Text>
            <Text style={styles.alertMessage}>Please select a location before proceeding.</Text>
            <TouchableOpacity
              onPress={() => setAlertVisible(false)}
              style={styles.alertButton}
            >
              <Text style={styles.alertButtonText}>OK</Text>
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
    paddingTop: 10,
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
  alertContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  alertContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  alertMessage: {
    textAlign: "center",
    marginBottom: 20,
  },
  alertButton: {
    backgroundColor: "#FF5722",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  alertButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default HomeScreen;
