import React, { useRef, useState, useEffect } from "react";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchChecklistByRole,AllCheckListType} from "../../services/schedulechecklistapi";
import AsyncStorage from '@react-native-async-storage/async-storage';



function TypeofCheckList({ navigation, route }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();
  ////const locationId = "10701";
  const [filteredChecklists, setFilteredChecklists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [EmpID, setEmpID] = useState(null);
  const [locationid, setLocationID] = useState(null);
 


  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('auth'); // Assuming 'auth' is the key you are using
       /// console.log("storage1",storedUser);
        if (storedUser) {
          const user = JSON.parse(storedUser);
          console.log("storage2",user);
          // Extract EmpID and locationid from the stored data
          setEmpID(user.id);
          setLocationID(user.usernametmslocation); // Assuming tmsemployeelocationcode is the locationid
        }
      } catch (error) {
        console.log('Error loading user data from AsyncStorage:', error);
      }
    };

    loadUserData();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      if (!EmpID || !locationid) return; // If EmpID or locationid are not available, skip the fetch
////console.log("EmpID",EmpID);
///console.log("locationid",locationid);

      try {
        const data = await fetchChecklistByRole(EmpID, locationid);
     console.log("data",data);
        // Filter predefined checklists based on API data
        const filtered = checklists.filter((checklist) =>
          data.some((apiItem) => {
            const checklistTitle = checklist.ctid;
          //////     console.log("checklistTitle",checklistTitle)
            const checkListTypeName = apiItem.ctid;
         ////   console.log("checkListTypename",checkListTypeName)

            return checkListTypeName == checklistTitle;
          })
        );

        setFilteredChecklists(filtered);
       
        setLoading(false);
      } catch (error) {
        console.error('Error fetching checklist:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [EmpID, locationid]); // Depend on EmpID and locationid



  const checklists = [
    {
      id: "1",
      ctid: "10",
      title: "Triggered Checklist",
      route: "Digital_Checklist_App/TriggeredChecklist",
      icon: "alarm",
    },
    {
      id: "2",
      ctid: "12",
      title: "Schedule Checklist",
      route: "Digital_Checklist_App/ScheduleChecklist",
      icon: "calendar",
    },
    {
      id: "3",
      ctid: "13",
      title: "Instant Checklist",
      route: "Digital_Checklist_App/InstantChecklist",
      icon: "flash",
    },
  ];

  const handleNavigation = (baseRoute, ctid) => {
    router.push({ pathname: baseRoute, params: { ctid } });
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

 

  const renderItem = ({ item }) => {
    const isMatch = filteredChecklists.some(
      (checklist) => checklist.ctid == item.ctid
    ); // Check if the item matches the filtered list
 ///   console.log("isMatch",isMatch);

    return (
      <TouchableOpacity
        key={item.id}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => isMatch && handleNavigation(item.route, item.ctid)} // Pass route and ctid
        activeOpacity={0.7}
        disabled={!isMatch} // Disable the touch if not a match
      >
        <Animated.View
          style={[styles.card, { transform: [{ scale: scaleAnim }] }, !isMatch && styles.disabledCard]}
        >
          <Ionicons
            name={item.icon}
            size={30}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.textStyle}>{item.title}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : filteredChecklists.length > 0 ? (
        <FlatList
          data={checklists} // Use the original checklists array to ensure everything is displayed
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.textStyle}>No Checklists Available</Text>
      )}
      <Stack.Screen
        options={{
          title: "Type of Checklist",
          statusBarColor: "black",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/applist")}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 20,
  },
  listContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 130,
    borderRadius: 25,
    backgroundColor: "#4C6B8C",
    marginBottom: 20,
    flexDirection: "row",
    paddingHorizontal: 25,
    paddingVertical: 15,
    elevation: 5,
    marginTop: 35,
  },
  disabledCard: {
    backgroundColor: "#b0b0b0", // Gray out the card for non-matching items
  },
  icon: {
    marginRight: 20,
  },
  textStyle: {
    fontSize: 19,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    flexWrap: "wrap",
    width: "70%",
  },
});

export default TypeofCheckList;
