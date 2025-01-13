import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, FlatList, SafeAreaView  } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CustomDatePicker from "../../projects/digital_check_list/components/getcustomdaterange";
import FilterModal from "../../projects/digital_check_list/components/filterbox";
import ScheduleMenuItem from "../../projects/digital_check_list/components/getmenuitemsforschedule";
import CustomDropdown from "../../projects/digital_check_list/components/getdropdownschedule";
import CustomAlert from "../../projects/digital_check_list/components/alertmessage";
import ConfirmCustomAlert from "../../projects/digital_check_list/components/confirmalert";
import { fetchDepartments, fetchCheckLists, fetchMenuDetails } from "../../services/triggeredchecklistapi";
import { fetchMenuDetailSchedule } from "../../services/schedulechecklistapi";
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from 'react-native-vector-icons'; // Import the icon library

const App = () => {
  const router = useRouter();
  const { ctid } = useLocalSearchParams(); // Use useLocalSearchParams to access query params
  const locationId = "10701";

  const [menu, setMenu] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [openDeptDropdown, setOpenDeptDropdown] = useState(false);
  const [checkLists, setCheckLists] = useState([]);
  const [selectedCheckList, setSelectedCheckList] = useState(null);
  const [openChecklistDropdown, setOpenChecklistDropdown] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);  // Manages alert visibility
  const [alertTitle, setAlertTitle] = useState("");         // Manages alert title
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const memoizedDepartments = useMemo(() => departments, [departments]);
  const memoizedCheckLists = useMemo(() => checkLists, [checkLists]);

  const filteredMenu = useMemo(() => {
    if (!filterStatus) return menu;
    return menu.filter((item) => item.finalSave === filterStatus);
  }, [menu, filterStatus]);

  useEffect(() => {
    fetchDepartments(locationId).then((data) => {
      if (Array.isArray(data)) {
        setDepartments(
          data.map((dept) => ({
            label: dept.departmentName,
            value: dept.departmentId,
          }))
        );
      }
    });
  }, [locationId]);

  useEffect(() => {
    if (selectedDepartment) {
      fetchCheckLists(locationId, selectedDepartment, ctid).then((data) => {
        if (Array.isArray(data)) {
          setCheckLists(
            data.map((list) => ({
              label: list.checklist_name,
              value: list.checklist_id,
            }))
          );
        } else {
          setCheckLists([]);
        }
      });
    }
  }, [selectedDepartment, locationId, ctid]);

  const handleSearch = async () => {
   if (selectedCheckList && fromDate && toDate && locationId) 
     {
      const menuDetails = await fetchMenuDetailSchedule(
        selectedCheckList,
        fromDate,
        toDate,
        locationId
      );
      console.log("Menu item", menuDetails);
      if (menuDetails && menuDetails.length > 0) {
        setMenu(menuDetails);
        setIsMenuVisible(true);
      } else {
        setMenu([]);
        setIsMenuVisible(false);
      }
  }
    
    else {
      // Set alert details and make it visible
      setAlertTitle("Selection Required Fields");
      setAlertMessage("Please select a checklist and valid date range.");
      setAlertVisible(true);
    }
  };

  const handleClear = useCallback(() => {
    setIsAlertVisible(true); // Show the custom alert modal
  }, []);

  const handleConfirmClear = () => {
    // Perform the clear action when "OK" is pressed
    setSelectedDepartment("");
    setSelectedCheckList(null);
    setFromDate(new Date());
    setToDate(new Date());
    setMenu([]);
    setIsMenuVisible(false);
    setIsAlertVisible(false); // Hide the alert after clearing
  };

  const handleCancelClear = () => {
    // Close the alert when "Cancel" is pressed
    setIsAlertVisible(false);
  };

  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <Stack.Screen
          options={{
            title: 'Schedule Checklist',
            statusBarColor: 'black',
            headerTitleAlign: 'center',  
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                <Ionicons name="arrow-back" size={24} color="black" /> 
              </TouchableOpacity>
            ),
          }}
        />
  
        <CustomDropdown
          open={openDeptDropdown}
          value={selectedDepartment}
          items={memoizedDepartments}
          setOpen={setOpenDeptDropdown}
          setValue={setSelectedDepartment}
          placeholder="Select Department"
          searchPlaceholder="Search departments..."
        />
        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />

      
        <CustomDropdown
          open={openChecklistDropdown}
          value={selectedCheckList}
          items={memoizedCheckLists}
          setOpen={setOpenChecklistDropdown}
          setValue={setSelectedCheckList}
          placeholder="Select Checklist"
          searchPlaceholder="Search checklists..."
        />

        <View style={styles.dateRow}>
          <View style={styles.datePickerContainer}>
            <CustomDatePicker
              fromDate={fromDate}
              toDate={toDate}
              setFromDate={setFromDate}
              setToDate={setToDate}
            />
          </View>
        </View>

        {isMenuVisible ? (
          <FlatList
            data={filteredMenu}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <ScheduleMenuItem item={item} />}
            ListEmptyComponent={
              <Text style={styles.noDataText}>No data available</Text>
            }
            nestedScrollEnabled
            style={styles.menuList}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}></Text>
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => setIsFilterModalVisible(true)}
            style={styles.filterButton}
          >
            <FontAwesome name="filter" size={20} color="#A490F6" />
            <Text style={styles.buttonText}>Filter</Text>
          </TouchableOpacity>

          <View style={styles.rightButtons}>
            <TouchableOpacity onPress={handleSearch} style={styles.button}>
              <FontAwesome name="search" size={20} color="#A490F6" />
              <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClear} style={styles.button}>
              <FontAwesome name="times" size={20} color="#A490F6" />
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
            <ConfirmCustomAlert
              visible={isAlertVisible}
              title="Clear Selection"
              message="Are you sure you want to clear the selections?"
              onConfirm={handleConfirmClear}
              onCancel={handleCancelClear}
            />
          </View>
        </View>
        <FilterModal
          visible={isFilterModalVisible}
          onClose={() => setIsFilterModalVisible(false)}
          onApplyFilter={(finalSave) => {
            setFilterStatus(finalSave);
            setIsFilterModalVisible(false);
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontFamily: "Mullish",
    marginBottom: 8,
    color: "darkblack",
    fontWeight: "800",
  },
  dropdown: {
    borderColor: "#A490F6",
    marginBottom: 16,
    zIndex: 15,
    borderBottomColor: "#A490F6",
    color: "black",
  },
  dropdownContainer: {
    borderColor: "#A490F6",
    borderWidth: 1,
    maxHeight: 500,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  datePickerContainer: {
    flex: 1,
    marginRight: 5,
    fontFamily: "Mullish",
    borderColor: "#A490F6",
    alignSelf: "auto", // Optional for additional control
  },
  menuList: {
    flex: 1,
    marginTop: 16,
    borderColor: "#A490F6",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
    color: "black",
    fontFamily: "Mullish",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
    paddingHorizontal: 10,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  rightButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    marginLeft: 10,
  },
  buttonText: {
    marginLeft: 6,
    fontSize: 16,
    color: "#A490F6",
    fontFamily: "Mullish",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
  },


  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
  },
  menuList: {
    flex: 1,
    marginTop: 16,
    borderColor: "#A490F6",
  },
  ScheduleMenuItemContainer: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  ScheduleMenuItemRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  ScheduleMenuItemKey: {
    fontWeight: 'bold',
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  ScheduleMenuItemValue: {
    fontSize: 14,
    color: "#666",
    flex: 2,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
    color: "black",
  },
});

export default App;
